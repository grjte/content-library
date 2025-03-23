import { useEffect, useState } from "react";
import { AutomergeUrl, isValidAutomergeUrl, Repo } from "@automerge/automerge-repo"
import { RepoContext } from "@automerge/automerge-repo-react-hooks"
import { useNavigate } from "react-router-dom"
import { ContentManager } from "./components/management/ContentManager"
import { Index } from "./types/automerge";
import dayjs from "dayjs";
import { CollectionIndex } from "./types/automerge/collectionIndex";

export default function LocalFirstAppView({ repo }: { repo: Repo }) {
    const navigate = useNavigate();
    const [collectionUrl, setCollectionUrl] = useState<AutomergeUrl | null>();

    // Get the collection doc from the URL
    useEffect(() => {
        const updateIndex = async (collectionUrl: AutomergeUrl) => {
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

        const docUrl = window.location?.hash?.substring(1)

        let handle
        if (isValidAutomergeUrl(docUrl)) {
            handle = repo.find(docUrl)
            updateIndex(handle.url)
            setCollectionUrl(handle.url)
        } else {
            navigate(`/collections`, { replace: true })
        }

    }, [])

    return (
        collectionUrl == null
            ? <p>Loading...</p>
            : <RepoContext.Provider value={repo}>
                <ContentManager collectionUrl={collectionUrl!} />
            </RepoContext.Provider>
    )
}