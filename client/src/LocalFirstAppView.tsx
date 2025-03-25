import { Outlet, useParams, useLocation } from "react-router-dom"
import { AutomergeUrl, isValidAutomergeUrl, Repo } from "@automerge/automerge-repo"
import { RepoContext } from "@automerge/automerge-repo-react-hooks"
import { useEffect } from "react"
import { Index } from "./types/automerge"
import { CollectionIndex } from "./types/automerge/CollectionIndex"
import dayjs from "dayjs"

export default function LocalFirstAppView({ repo }: { repo: Repo }) {
    const { collection } = useParams();
    const collectionUrl = collection as AutomergeUrl;

    // Update index when navigating to a collection
    useEffect(() => {
        const updateIndex = async () => {
            if (!collectionUrl) return;
            // get the existing index doc or create a new one
            const indexUrl = localStorage.getItem('content-library-index')
            let indexHandle

            const collectionHandle = repo.find<CollectionIndex>(collectionUrl)
            const collectionDoc = await collectionHandle.doc()

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