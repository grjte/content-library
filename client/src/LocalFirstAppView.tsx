import { useEffect, useState } from "react";
import { AutomergeUrl, isValidAutomergeUrl, Repo } from "@automerge/automerge-repo"
import { RepoContext } from "@automerge/automerge-repo-react-hooks"
import { CollectionIndex } from "./types/automerge/collectionIndex";
import { useNavigate } from "react-router-dom"
import { ContentManager } from "./components/management/ContentManager"

export default function LocalFirstAppView({ repo }: { repo: Repo }) {
    const navigate = useNavigate();
    const [collectionUrl, setCollectionUrl] = useState<AutomergeUrl | null>();

    // Get the collection doc from the URL
    useEffect(() => {
        const docUrl = window.location?.hash?.substring(1)

        let handle
        if (isValidAutomergeUrl(docUrl)) {
            handle = repo.find(docUrl)
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