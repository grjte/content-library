import { AutomergeUrl, isValidAutomergeUrl, Repo } from "@automerge/automerge-repo"
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { CollectionIndex } from "../../types/automerge/collectionIndex"
import { Index } from "../../types/automerge/index"
import { Header } from "../Header"

export function CollectionManager({ repo }: { repo: Repo }) {
    const [collections, setCollections] = useState<AutomergeUrl[]>([])
    const [indexUrl, setIndexUrl] = useState<AutomergeUrl | null>(null)
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
            setIndexUrl(indexUrl)
            loadCollections(indexUrl)
        } else {
            const collectionHandle = repo.create<CollectionIndex>({
                entries: {},
            })

            // create a new index doc if it doesn't exist and navigate to it
            indexHandle = repo.create<Index>({
                collections: [collectionHandle.url],
            })
            setIndexUrl(indexHandle.url)
            localStorage.setItem('content-library-index', indexHandle.url)
            navigate(`#${collectionHandle.url}`)
        }

    }, [])

    const createCollection = () => {
        const collectionHandle = repo.create<CollectionIndex>({
            entries: {},
        })

        const indexHandle = repo.find<Index>(indexUrl!)
        indexHandle.change(doc => {
            doc.collections.push(collectionHandle.url)
        })

        navigate(`#${collectionHandle.url}`)
    }

    return (
        <div>
            <Header isPublicView={false} />
            <div className="pt-24 pb-20 bg-gray-50 min-h-screen">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-semibold text-gray-900">
                                Collections
                                <span className="ml-2 text-sm text-gray-500 font-normal">
                                    ({collections.length} {collections.length === 1 ? 'collection' : 'collections'})
                                </span>
                            </h2>
                            <button
                                onClick={createCollection}
                                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                New Collection
                            </button>
                        </div>

                        {collections.length === 0 ? (
                            <div className="text-center py-12 bg-gray-50 rounded-lg">
                                <p className="text-gray-500">No collections yet. Create your first collection to get started.</p>
                            </div>
                        ) : (
                            <ul className="divide-y divide-gray-200">
                                {collections.map((collection) => (
                                    <li key={collection} className="py-3">
                                        <Link
                                            to={`/#${collection}`}
                                            className="flex items-center justify-between group p-2 hover:bg-gray-50 rounded-md transition-colors"
                                        >
                                            <div className="flex items-center">
                                                <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                                </svg>
                                                <span className="text-sm font-medium text-gray-900 group-hover:text-blue-600">
                                                    {collection}
                                                </span>
                                            </div>
                                            <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}