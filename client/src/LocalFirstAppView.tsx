import { Outlet, useParams, useLocation } from "react-router-dom"
import { AutomergeUrl, isValidAutomergeUrl, Repo } from "@automerge/automerge-repo"
import { RepoContext } from "@automerge/automerge-repo-react-hooks"
import { useEffect } from "react"
import { Index } from "./types/automerge"
import { CollectionIndex } from "./types/automerge/collectionIndex"
import dayjs from "dayjs"
import { useOAuthSession } from "./context/ATProtoSessionContext"
import { OAuthSession } from "@atproto/oauth-client-browser"
import { BrowserWebSocketClientAdapter } from "@automerge/automerge-repo-network-websocket"
import { Agent } from "@atproto/api"

type PSSRecord = {
    host: string
}

export default function LocalFirstAppView({ repo }: { repo: Repo }) {
    const { collection } = useParams();
    const collectionUrl = collection as AutomergeUrl;
    const session = useOAuthSession();

    // Get the personal sync server url from the user's PDS when there's an active session
    // and open a web socket connection to it
    useEffect(() => {
        const findAndConnectToSyncServer = async (session: OAuthSession) => {
            const agent = new Agent(session)
            const pdsResponse = await agent.com.atproto.repo.getRecord({
                repo: session.did,
                collection: "app.lofisky.pss",
                rkey: "sync_server",
            })
            if (pdsResponse.success) {
                const pssHost = (pdsResponse.data.value as PSSRecord).host;
                console.log('PSS host:', pssHost);

                if (pssHost) {
                    // Use the fetchHandler to make an authenticated request to the sync server to get a token
                    const pssResponse = await session.fetchHandler(`https://${pssHost}/authenticate`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            lexiconAuthorityDomain: "app.lofisky.library",
                        }),
                    });
                    const data = await pssResponse.json();
                    console.log('Server response:', data);

                    if (pssResponse.ok) {
                        // connect to the sync server using the access token
                        console.log(repo)
                        console.log("Connecting to sync server...");
                        repo.networkSubsystem.addNetworkAdapter(new BrowserWebSocketClientAdapter(`wss://${pssHost}?token=${data.token}`));
                        console.log("Connected to sync server");
                    } else {
                        console.error('Authentication failed');
                    }
                }
            }
        }
        if (session) {
            findAndConnectToSyncServer(session)
        }
    }, [session])

    // Update index when navigating to a collection
    useEffect(() => {
        const updateIndex = async () => {
            if (!collectionUrl) return;
            // get the existing index doc or create a new one
            const indexUrl = localStorage.getItem('content-library-index')
            let indexHandle

            const collectionHandle = repo.find<CollectionIndex>(collectionUrl)

            if (isValidAutomergeUrl(indexUrl)) {
                indexHandle = repo.find<Index>(indexUrl)
            } else {
                // create a new index doc
                indexHandle = repo.create<Index>({
                    collections: {}
                })
                localStorage.setItem('content-library-index', indexHandle.url)
            }

            const indexDoc = await indexHandle.doc()
            // check if the collection is already in the index
            if (!indexDoc!.collections[collectionUrl]) {
                indexHandle.change(doc => {
                    doc.collections[collectionUrl] = {
                        automergeUrl: collectionUrl,
                        name: `${collectionUrl}`,
                        createdAt: dayjs().toISOString(),
                    }
                })
            }
            // TODO: deal with collection remote name updates?
            // TODO: in the future, update state when it's shared with someone who's not the same user on a different device
        }

        updateIndex()
    }, [repo, collectionUrl])



    return (
        <RepoContext.Provider value={repo}>
            <Outlet />
        </RepoContext.Provider>
    )
}