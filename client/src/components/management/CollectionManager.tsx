import { AutomergeUrl, isValidAutomergeUrl, Repo } from "@automerge/automerge-repo"
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { CollectionIndex } from "../../types/automerge/collectionIndex"
import { Index } from "../../types/automerge/index"
import { Header } from "../Header"

export function CollectionManager({ repo }: { repo: Repo }) {
    const [collections, setCollections] = useState<AutomergeUrl[]>([])
    const navigate = useNavigate()

    // Get the index document
    useEffect(() => {
        let indexHandle
        const loadCollections = async (indexUrl: AutomergeUrl) => {
            indexHandle = repo.find(indexUrl)
            const indexDoc = await indexHandle.doc() as Index
            setCollections(indexDoc.collections)
        }

        // If no collection is specified by the URL, check the index doc and list collections.
        // If there's no index doc, create a new one.
        const indexUrl = localStorage.getItem('content-library-index')
        if (isValidAutomergeUrl(indexUrl)) {
            loadCollections(indexUrl)
        } else {
            const collectionHandle = repo.create<CollectionIndex>({
                entries: {},
            })

            // create a new index doc if it doesn't exist and navigate to it
            indexHandle = repo.create<Index>({
                collections: [collectionHandle.url],
            })
            localStorage.setItem('content-library-index', indexHandle.url)
            navigate(`#${collectionHandle.url}`)
        }

    }, [])

    return (
        <div>
            <Header isPublicView={false} />
            <div className="pt-24 pb-20 bg-gray-50 min-h-screen">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <ul>
                        {collections.map((collection) => (
                            <li key={collection}>
                                <Link to={`/#${collection}`}>{collection}</Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}