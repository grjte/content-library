import dayjs from "dayjs";
import { Content, DisplayContent, editableToLexicon, LexiconRecord, lexiconToDisplay, $type } from "../types/content";
import { CollectionIndex } from "../types/automerge/collectionIndex";
import { EditableContent, createEditableContent } from "../types/automerge/editableContent";
import { AutomergeUrl, Repo } from "@automerge/automerge-repo";
import AtpAgent, { Agent, RichText } from "@atproto/api";
import { OAuthSession } from "@atproto/oauth-client-browser";

// // TODO: should probably use an index for this instead of pulling all public entries
// export const updateLocalFromPublic = async (repo: Repo, privateIndexUrl: AutomergeUrl, did: string) => {
//     try {
//         const indexHandle = repo.find<CollectionIndex>(privateIndexUrl);
//         const CollectionIndex = await indexHandle.doc() as CollectionIndex;
//         const publicEntries = await getPublicEntries(did);

//         // if it does not exist, add it locally
//         publicEntries.forEach((entry) => {
//             if (!CollectionIndex.entries[entry.id]) {
//                 // Create a new document using the repo
//                 createEntry(repo, privateIndexUrl, entry);
//             } else {
//                 // TODO
//                 // if it does exist, then the local version should be the canonical one. If there's a mismatch, 
//                 // then first sync the local version with other local-first devices, then update the public 
//                 // version to match the local version
//             }
//         })
//     } catch (e) {
//         console.error("Error updating local from public:", e);
//         throw e;
//     }
// }

export const createEntry = async (repo: Repo, privateIndexUrl: AutomergeUrl, content: Content) => {
    try {
        // Create a new document using the repo
        const handle = repo.create<Content>();
        if (!handle.isReady()) {
            await new Promise<void>((resolve) => {
                handle.on('change', () => resolve());
            });
        }

        const entry = createEditableContent(content, handle.url);
        handle.change((doc: Content) => {
            Object.assign(doc, entry);
        });

        const indexHandle = repo.find<CollectionIndex>(privateIndexUrl);
        if (!indexHandle.isReady()) {
            await new Promise<void>((resolve) => {
                indexHandle.on('change', () => resolve());
            });
        }
        indexHandle.change((doc) => {
            doc.entries[entry.id] = {
                type: entry.content.$type,
                date: entry.createdAt,
                automergeUrl: entry.automergeUrl,
                isPublic: false
            }
        })

        return handle.url;
    } catch (e) {
        console.error('Error adding entry:', e);
        throw e;
    }
}

export const publishEntry = async (session: OAuthSession, repo: Repo, entry: EditableContent, postToBsky: boolean = true) => {
    try {
        const agent = new Agent(session)
        const response = await agent.app.bsky.actor.getProfile({ actor: session.did })
        const userHandle = response.data?.handle

        // Publish the entry to ATProto
        const lexiconEntry = editableToLexicon(entry)
        const collection = $type
        const entryCreate = {
            $type: 'com.atproto.repo.applyWrites#create',
            collection: collection,
            rkey: lexiconEntry.id,
            value: {
                ...lexiconEntry,
            },
        }

        let writes = [entryCreate as any];

        if (postToBsky) {
            // creating richtext
            // TODO: this is a hack; do it better
            const rt1 = new RichText({
                text: `Recommended and saved to ${import.meta.env.VITE_APP_URL}/${userHandle}`,
            })
            await rt1.detectFacets(agent)
            const bskyPostCreate = {
                $type: 'com.atproto.repo.applyWrites#create',
                collection: "app.bsky.feed.post",
                value: {
                    text: "Recommended and saved to my collection",
                    facets: [
                        {
                            index: {
                                byteStart: rt1.facets?.[0]?.index.byteStart,
                                byteEnd: rt1.facets?.[0]?.index.byteEnd
                            },
                            features: [
                                {
                                    $type: 'app.bsky.richtext.facet#link',
                                    uri: `${import.meta.env.VITE_APP_URL}/${userHandle}`,
                                }
                            ]
                        }
                    ],
                    createdAt: dayjs().toISOString(),
                    embed: {
                        $type: 'app.bsky.embed.external',
                        // TODO: think about how best to do the URLs
                        external: {
                            uri: lexiconEntry.uri || `${import.meta.env.VITE_APP_URL}/${userHandle}/${lexiconEntry.id}`,
                            title: (lexiconEntry.content as Content).title || (lexiconEntry.content as Content).uri,
                            description: (lexiconEntry.content as Content).description || (lexiconEntry.content as Content).author?.join(', ') || `recommended ${lexiconEntry.content.$type}`,
                            // TODO: add image
                        }
                    }
                }
            }

            writes.push(bskyPostCreate);
        }

        await agent.com.atproto.repo.applyWrites({
            repo: session.did,
            writes: writes
        })

        // Update the entry to be public if the publish was successful
        const entryHandle = repo!.find<EditableContent>(entry.automergeUrl!);
        entryHandle.change((doc) => {
            doc.isPublic = true;
            doc.publishedBy = session.did;
        });
    } catch (e) {
        console.error('Error publishing entry:', e);
        throw e;
    }
}

export const updateLocalEntry = async (repo: Repo, privateIndexUrl: AutomergeUrl, updatedEntry: EditableContent, dateChanged: boolean = false) => {
    try {
        const handle = repo.find<EditableContent>(updatedEntry.automergeUrl);
        handle.change((doc) => {
            Object.assign(doc, updatedEntry);
        })

        // if the createdAt is different, update the index
        if (dateChanged) {
            const indexHandle = repo.find<CollectionIndex>(privateIndexUrl);
            indexHandle.change((doc) => {
                doc.entries[updatedEntry.id] = {
                    type: updatedEntry.content.$type,
                    automergeUrl: updatedEntry.automergeUrl,
                    date: updatedEntry.createdAt,
                    isPublic: updatedEntry.isPublic
                }
            })
        }
    } catch (e) {
        console.error('Error adding entry:', e);
        throw e;
    }
}


export const updatePublicEntry = async (session: OAuthSession, entry: EditableContent) => {
    try {
        const agent = new Agent(session)
        // update the entry in the ATProto PDS
        const lexiconEntry = editableToLexicon(entry);
        const collection = $type;
        await agent.com.atproto.repo.putRecord({
            repo: session.did,
            collection: collection,
            rkey: lexiconEntry.id,
            record: lexiconEntry,
        })
    } catch (e) {
        console.error('Error updating public entry:', e);
        throw e;
    }
}

export const deletePublicEntry = async (session: OAuthSession, id: string) => {
    // Update the ATProto PDS
    const agent = new Agent(session)

    // delete the entry from ATProto
    const collection = $type;
    const entryDelete = {
        $type: 'com.atproto.repo.applyWrites#delete',
        collection: collection,
        rkey: id,
    }

    try {
        await agent.com.atproto.repo.applyWrites({
            repo: session.did,
            writes: [
                entryDelete,
            ]
        })
    } catch (e) {
        console.error('Error deleting public entry:', e);
        throw e;
    }
}

export const getPublicEntries = async (did: string): Promise<DisplayContent[]> => {
    try {
        const agent = new AtpAgent({
            service: import.meta.env.VITE_ATPROTO_ENTRYWAY_URL
        })
        const records = await agent.com.atproto.repo.listRecords({
            repo: did,
            collection: $type,
        })
        const entries = records.data.records.map((record) => lexiconToDisplay(record.value as LexiconRecord));
        return entries
    } catch (e) {
        console.error('Error getting entries from ATProto:', e)
        throw e
    }
}


// TODO: remove this when delete is working properly
// utility function to clear all public entries from ATProto
export const clearPublicEntries = async (session: OAuthSession, did: string) => {
    const agent = new Agent(session)
    const collection = `${import.meta.env.VITE_APP_NSID}.entry`

    try {
        const records = await agent.com.atproto.repo.listRecords({
            repo: did,
            collection: `${import.meta.env.VITE_APP_NSID}.entry`,
        })

        const deletes = records.data.records.map((record) => {
            return {
                $type: 'com.atproto.repo.applyWrites#delete',
                collection: collection,
                rkey: (record.value as LexiconRecord).id,
            }
        });
        await agent.com.atproto.repo.applyWrites({
            repo: session.did,
            writes: deletes
        })
    } catch (e) {
        console.error("Failed to clear public entries:", e)
        throw e
    }
}
