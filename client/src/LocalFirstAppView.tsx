import { useEffect, useState } from "react";
import { AutomergeUrl, isValidAutomergeUrl, Repo } from "@automerge/automerge-repo"
import { RepoContext } from "@automerge/automerge-repo-react-hooks"
import { IndexDoc } from "./types/automerge/indexDoc";
import { useNavigate } from "react-router-dom"
import { ContentManager } from "./components/management/ContentManager"

export default function LocalFirstAppView({ repo }: { repo: Repo }) {
    const navigate = useNavigate();
    const [rootDocUrl, setRootDocUrl] = useState<AutomergeUrl | null>();

    // Get the root doc url from the URL or create a new one then navigate to the root doc url
    useEffect(() => {
        const docUrl = window.location?.hash?.substring(1)

        let handle
        if (isValidAutomergeUrl(docUrl)) {
            handle = repo.find(docUrl)
            setRootDocUrl(handle.url)
        } else {
            // create a new index doc if it doesn't exist
            handle = repo.create<IndexDoc>({
                entries: {},
            })
            setRootDocUrl(handle.url)
            navigate(`#${handle.url}`, { replace: true })
        }

    }, [])

    return (
        rootDocUrl == null
            ? <p>Loading...</p>
            : <RepoContext.Provider value={repo}><ContentManager rootDocUrl={rootDocUrl!} /></RepoContext.Provider>
    )
}