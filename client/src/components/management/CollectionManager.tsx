import { AutomergeUrl, isValidAutomergeUrl, Repo } from "@automerge/automerge-repo"
import { useEffect, useState, useRef, useContext } from "react"
import { Link, useNavigate } from "react-router-dom"
import { CollectionIndex } from "../../types/automerge/collectionIndex"
import { Index, IndexItem } from "../../types/automerge/index"
import { Header } from "../Header"
import dayjs from "dayjs"
import { RepoContext } from "@automerge/automerge-repo-react-hooks"

export function CollectionManager() {
    const repo = useContext(RepoContext) as Repo;
    const [collections, setCollections] = useState<IndexItem[]>([])
    const [indexUrl, setIndexUrl] = useState<AutomergeUrl | null>(null)
    const [editingCollection, setEditingCollection] = useState<AutomergeUrl | null>(null)
    const [newName, setNewName] = useState("")
    const [openMenu, setOpenMenu] = useState<AutomergeUrl | null>(null)
    const [deleteConfirmation, setDeleteConfirmation] = useState<AutomergeUrl | null>(null)
    const [nameError, setNameError] = useState<string>("")
    const navigate = useNavigate()

    const handleBackgroundClick = () => {
        setOpenMenu(null)
        setDeleteConfirmation(null)
    }

    // Get the index document
    useEffect(() => {
        let indexHandle
        const loadCollections = async (indexUrl: AutomergeUrl) => {
            indexHandle = repo.find(indexUrl)
            const indexDoc = await indexHandle.doc() as Index
            setCollections(Object.values(indexDoc.collections))
        }

        // If no collection is specified by the URL, check the index doc and list collections.
        // If there's no index doc, create a new one.
        const indexUrl = localStorage.getItem('xyz.groundmist.library:indexUrl')
        if (isValidAutomergeUrl(indexUrl)) {
            setIndexUrl(indexUrl)
            loadCollections(indexUrl)
        } else {
            // create a new index doc if it doesn't exist and navigate to it
            indexHandle = repo.create<Index>({
                collections: {},
            })
            // create an initial collection
            createCollection(indexHandle.url)
            localStorage.setItem('xyz.groundmist.library:indexUrl', indexHandle.url)
            setIndexUrl(indexHandle.url)
        }

    }, [])

    const createCollection = (indexUrl: AutomergeUrl) => {
        const collectionHandle = repo.create<CollectionIndex>({
            createdAt: dayjs().toISOString(),
            entries: {},
        })

        const name = collections.length === 0 ? "default" : collectionHandle.url
        collectionHandle.change(doc => {
            doc.name = name
        })

        const indexHandle = repo.find<Index>(indexUrl!)
        indexHandle.change(doc => {
            doc.collections[collectionHandle.url] = {
                automergeUrl: collectionHandle.url,
                name: name,
                createdAt: dayjs().toISOString()
            }
        })

        navigate(`/collections/${collectionHandle.url}`)
    }

    const validateName = (name: string): boolean => {
        if (name.trim().length === 0) {
            setNameError("Name cannot be empty")
            return false
        }
        if (name.length > 50) {
            setNameError("Name is too long (max 50 characters)")
            return false
        }
        if (collections.some(collection => collection.name === name)) {
            setNameError("A collection with this name already exists")
            return false
        }
        setNameError("")
        return true
    }

    const deleteCollection = (collectionUrl: AutomergeUrl) => {
        const indexHandle = repo.find<Index>(indexUrl!)
        indexHandle.change(doc => {
            delete doc.collections[collectionUrl]
        })
        setCollections(collections.filter(collection => collection.automergeUrl !== collectionUrl))
        setDeleteConfirmation(null)
        setOpenMenu(null)
    }

    const startEditing = (collectionUrl: AutomergeUrl) => {
        setEditingCollection(collectionUrl)
        setNewName(collections.find(collection => collection.automergeUrl === collectionUrl)?.name || "")
        setNameError("")
        setOpenMenu(null)
    }

    const saveEdit = (collectionUrl: AutomergeUrl) => {
        if (!validateName(newName)) {
            return
        }

        // Update the collection name in the collection document
        const collectionHandle = repo.find<CollectionIndex>(collectionUrl)
        collectionHandle.change(doc => {
            doc.name = newName
        })

        // Update the collection name in the index document
        const indexHandle = repo.find<Index>(indexUrl!)
        indexHandle.change(doc => {
            doc.collections[collectionUrl].name = newName
        })

        // Update local state
        setCollections(collections.map(collection =>
            collection.automergeUrl === collectionUrl
                ? { ...collection, name: newName }
                : collection
        ))

        setEditingCollection(null)
        setNewName("")
        setNameError("")
    }

    return (
        <div onClick={handleBackgroundClick}>
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
                                onClick={() => createCollection(indexUrl!)}
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
                                    <li key={collection.automergeUrl} className="py-3">
                                        <div className="flex items-center justify-between group p-2 hover:bg-gray-50 rounded-md transition-colors">
                                            <div className="flex items-center flex-grow">
                                                <svg className="w-5 h-5 text-gray-400 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                                </svg>

                                                {editingCollection === collection.automergeUrl ? (
                                                    <div className="flex-grow">
                                                        <div className="flex items-center">
                                                            <input
                                                                type="text"
                                                                value={newName}
                                                                onChange={(e) => {
                                                                    setNewName(e.target.value)
                                                                    validateName(e.target.value)
                                                                }}
                                                                className={`flex-grow px-2 py-1 border rounded-md text-sm ${nameError ? 'border-red-500' : 'border-gray-300'}`}
                                                                autoFocus
                                                            />
                                                            <button
                                                                onClick={() => saveEdit(collection.automergeUrl)}
                                                                className="ml-2 text-green-600 hover:text-green-700"
                                                                disabled={!!nameError}
                                                            >
                                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                                </svg>
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    setEditingCollection(null)
                                                                    setNameError("")
                                                                }}
                                                                className="ml-2 text-red-600 hover:text-red-700"
                                                            >
                                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                        {nameError && (
                                                            <p className="text-red-500 text-xs mt-1">{nameError}</p>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <Link
                                                        to={`/collections/${collection.automergeUrl}`}
                                                        className="flex-grow flex items-center"
                                                    >
                                                        <span className="text-sm font-medium text-gray-900 group-hover:text-blue-600">
                                                            {collection.name}
                                                        </span>
                                                    </Link>
                                                )}
                                            </div>

                                            <div className="relative">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        setOpenMenu(openMenu === collection.automergeUrl ? null : collection.automergeUrl)
                                                    }}
                                                    className="p-1 hover:bg-gray-100 rounded-full"
                                                >
                                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                                    </svg>
                                                </button>

                                                {openMenu === collection.automergeUrl && (
                                                    <div
                                                        onClick={(e) => e.stopPropagation()}
                                                        className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10"
                                                    >
                                                        <div className="py-1">
                                                            <button
                                                                onClick={() => startEditing(collection.automergeUrl)}
                                                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                            >
                                                                Rename
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    setDeleteConfirmation(collection.automergeUrl)
                                                                    setOpenMenu(null)
                                                                }}
                                                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Delete Confirmation Modal */}
                    {deleteConfirmation && (
                        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
                            <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Delete Collection</h3>
                                <p className="text-sm text-gray-500 mb-4">
                                    Are you sure you want to delete this collection? This action cannot be undone.
                                </p>
                                <div className="flex justify-end space-x-3">
                                    <button
                                        onClick={() => setDeleteConfirmation(null)}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => deleteCollection(deleteConfirmation)}
                                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}