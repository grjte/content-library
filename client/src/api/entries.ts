import dayjs from "dayjs";
import { Content, DisplayContent, editableToLexicon, LexiconRecord, lexiconToDisplay, $type } from "../types/content";
import { CollectionIndex } from "../types/automerge/collectionIndex";
import { EditableContent, createEditableContent } from "../types/automerge/editableContent";
import { AutomergeUrl, Repo } from "@automerge/automerge-repo";
import { Agent, CredentialSession, RichText } from "@atproto/api";
import { OAuthSession } from "@atproto/oauth-client-browser";

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

interface DidService {
    id: string;
    type: string;
    serviceEndpoint: string;
}

interface DidDocument {
    "@context": string | string[];
    id: string;
    service?: DidService[];
}

/**
 * Resolves a handle (e.g. "alice.bsky.social") to a DID by querying the
 * public identity resolution endpoint.
 *
 * @param handle - The handle to resolve.
 * @returns The resolved DID as a string.
 */
export async function resolveHandleToDid(handle: string): Promise<string> {
    const url = `${import.meta.env.VITE_ATPROTO_HANDLE_RESOLVER_URL}/xrpc/com.atproto.identity.resolveHandle?handle=${encodeURIComponent(handle)}`;
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Failed to resolve handle ${handle}: ${response.statusText}`);
    }

    const data: { did: string } = await response.json();
    return data.did;
}


/**
 * Given a handle or DID, fetch its DID document from the PLC directory
 * and extract the PDS service endpoint URL.
 *
 * @param handleOrDid - The handle or DID (e.g. "alice.bsky.social" or "did:plc:abcdef123456...")
 * @returns The PDS URL as a string.
 */
export async function getPdsUrl(handleOrDid: string): Promise<{ did: string, service: string }> {
    let did: string;
    if (handleOrDid.startsWith("did:")) {
        did = handleOrDid;
    } else {
        did = await resolveHandleToDid(handleOrDid);
    }
    // The PLC directory endpoint; adjust if needed for your DID method
    const url = `${import.meta.env.VITE_ATPROTO_PLC_DIRECTORY_URL}/${did}`;
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Failed to fetch DID document for ${did}: ${response.statusText}`);
    }

    const didDoc: DidDocument = await response.json();
    if (!didDoc.service || didDoc.service.length === 0) {
        throw new Error(`No service entries found in DID document for ${did}`);
    }

    // Look for the service entry corresponding to the AT Protocol PDS.
    const pdsService = didDoc.service.find(
        (s) => s.type === "AtprotoPersonalDataServer" || s.id.endsWith("#atproto_pds")
    );

    if (!pdsService) {
        throw new Error(`No AT Protocol PDS service found in DID document for ${did}`);
    }

    return { did, service: pdsService.serviceEndpoint };
}

export const getPublicEntries = async (handleOrDid: string): Promise<DisplayContent[]> => {
    try {
        const { did, service } = await getPdsUrl(handleOrDid);
        const session = new CredentialSession(new URL(service))
        const agent = new Agent(session)
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