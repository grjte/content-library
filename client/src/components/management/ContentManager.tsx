import { useState, useContext, useEffect } from 'react';
import { AutomergeUrl, Repo } from '@automerge/automerge-repo'
import { RepoContext, useDocument } from '@automerge/automerge-repo-react-hooks';
import { CollectionIndex } from '../../types/automerge/collectionIndex';
import { EditableContent } from '../../types/automerge/editableContent';
import dayjs from 'dayjs';
import { Book, Content, LexiconId, PodcastEpisode, Movie, TvShow, Uri } from '../../types/content';
import { Header } from '../Header';
import { ScrollTopButton } from '../display/ScrollTopButton';
import { EditableContentEntries } from './EditableContentEntries';
import { AddContentModal } from './modals/AddContentModal';
import { createEntry, deletePublicEntry, publishEntry, updateLocalEntry, updatePublicEntry } from '../../api/entries';
import { useOAuthSession } from '../../context/ATProtoSessionContext';
import { EditEntryModal } from './modals/EditEntryModal';
import { LoginModal } from '../common/LoginModal';
import { PublishModal } from './modals/PublishModal';

export function ContentManager({ collectionUrl }: { collectionUrl: AutomergeUrl }) {
    const repo = useContext(RepoContext) as Repo;
    const [CollectionIndex, changeCollectionIndex] = useDocument<CollectionIndex>(collectionUrl);
    const session = useOAuthSession();
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

    // TODO: deal with pagination
    const [entries, setEntries] = useState<EditableContent[]>([]);
    const [isAddContentModalOpen, setIsAddContentModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingEntry, setEditingEntry] = useState<EditableContent | null>(null);
    const [isPublishingEntry, setIsPublishingEntry] = useState(false);
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [selectedTypes, setSelectedTypes] = useState<Set<LexiconId>>(
        new Set([Book.$type, PodcastEpisode.$type, Movie.$type, TvShow.$type, Uri.$type])
    );
    const [showPublishModal, setShowPublishModal] = useState(false);
    const [selectedEntry, setSelectedEntry] = useState<EditableContent | null>(null);

    // Add state to track if any modal is open
    const isAnyModalOpen = isAddContentModalOpen || !!editingEntry || isLoginModalOpen || showPublishModal;

    // Load all content documents on mount
    useEffect(() => {
        const loadDocuments = async () => {
            if (CollectionIndex && CollectionIndex.entries) {
                try {
                    // Create an array of promises for loading documents
                    const documentPromises = Object.values(CollectionIndex.entries).map(entry => {
                        return repo.find(entry.automergeUrl).doc()
                    });

                    // Wait for all documents to load
                    const loadedDocs = await Promise.all(documentPromises);

                    // Filter out any null documents and cast to Content
                    const loadedEntries = loadedDocs
                        .filter((doc): doc is EditableContent => doc !== null)
                        .sort((a, b) =>
                            dayjs(b.createdAt).isBefore(dayjs(a.createdAt)) ? -1 : 1
                        );

                    setEntries(loadedEntries);
                } catch (error) {
                    console.error("Error loading documents:", error);
                }
            }
        };

        loadDocuments();
    }, [repo, CollectionIndex, CollectionIndex?.entries]);  // Add CollectionIndex.entries to dependencies

    const filteredEntries = entries.filter(entry => {
        const matchesType = selectedTypes.has(entry.content.$type as LexiconId);

        const searchTerm = debouncedQuery.toLowerCase();
        const matchesSearch = searchTerm === '' ||
            (entry.content as Content).title?.toLowerCase().includes(searchTerm) ||
            (entry.content as Content).author?.some(author =>
                author.toLowerCase().includes(searchTerm)
            );

        return matchesType && matchesSearch;
    });

    const handleAddContent = async (entry: Content) => {
        try {
            if (!repo) throw new Error('Repo not found');
            const entryId = await createEntry(repo, collectionUrl, entry);
            if (!entryId) throw new Error('Failed to create entry');
        } catch (e) {
            console.error('Error adding content:', e);
        }
    };


    const handleDelete = async (entry: EditableContent) => {
        if (entry.isPublic) {
            // if the entry is public, ensure the user is logged in so it can be deleted from ATProto
            if (!session) {
                setIsLoginModalOpen(true);
                return;
            } else {
                // delete the entry from the public index
                deletePublicEntry(session, entry.id);
            }
        }

        // Remove from repo
        await repo!.delete(entry.automergeUrl!);
        // Update the index
        changeCollectionIndex(d => {
            delete d.entries[entry.id];
        })
    };

    const handleEdit = (entry: EditableContent) => {
        setEditingEntry(entry);
    };

    const handleSaveEdit = async (updated: EditableContent, dateChanged: boolean = false) => {
        // Remove any remaining undefined values
        const updatedEntry = Object.fromEntries(
            Object.entries(updated).filter(([_, value]) => value !== undefined)
        ) as EditableContent;

        if (updatedEntry.isPublic) {
            if (!session) {
                setIsLoginModalOpen(true);
                return;
            } else {
                await updatePublicEntry(session, updatedEntry);
            }
        }

        await updateLocalEntry(repo!, collectionUrl, updatedEntry, dateChanged);

        // Update this entry in the local state
        setEntries((prev: EditableContent[]) => prev.map(entry => {
            if (entry.id === updatedEntry.url) {
                return { ...entry, ...updatedEntry } as EditableContent;
            }
            return entry;
        }));

        setEditingEntry(null);
    };

    const handlePublishClick = (entry: EditableContent) => {
        if (!session) {
            setIsLoginModalOpen(true);
        } else {
            setSelectedEntry(entry);
            setShowPublishModal(true);
        }
    };

    const handleConfirmPublish = async (postToBsky: boolean) => {
        if (!session || !selectedEntry) return;
        try {
            setIsPublishingEntry(true);
            // update the public index and the entry and publish both
            await publishEntry(session, repo!, selectedEntry, postToBsky);

            // Update this entry in the local state
            setEntries((prev: EditableContent[]) => prev.map(e => {
                if (e.id === selectedEntry.id) {
                    return { ...e, isPublic: true, publishedBy: session.did };
                }
                return e;
            }));

            // Update the private index
            changeCollectionIndex(d => {
                d.entries[selectedEntry.id] = {
                    ...d.entries[selectedEntry.id],
                    isPublic: true,
                }
            });
        } catch (error) {
            console.error("Error publishing entry:", error)
        } finally {
            setShowPublishModal(false);
            setIsPublishingEntry(false);
            setSelectedEntry(null);
        }
    }


    // Update ESC key handling to only work when no modal is open
    useEffect(() => {
        const handleEscapeKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && !isAnyModalOpen) {
                handleBackgroundClick();
            }
        };

        document.addEventListener('keydown', handleEscapeKey);

        return () => {
            document.removeEventListener('keydown', handleEscapeKey);
        };
    }, [isAnyModalOpen]); // Add isAnyModalOpen to dependencies

    const handleBackgroundClick = () => {
        setShowFilters(false);
        setIsEditMode(false);
    };

    return (
        <div onClick={handleBackgroundClick}>
            <Header
                isPublicView={false}
                showFilters={showFilters}
                setShowFilters={setShowFilters}
                isEditMode={isEditMode}
                setIsEditMode={setIsEditMode}
                setIsAddModalOpen={setIsAddContentModalOpen}
                selectedTypes={selectedTypes}
                setSelectedTypes={setSelectedTypes}
                setDebouncedQuery={setDebouncedQuery}
            />

            <EditableContentEntries
                filteredEntries={filteredEntries}
                isPublicView={false}
                isEditMode={isEditMode}
                isPublishingEntry={isPublishingEntry}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                handlePublishClick={handlePublishClick}
            />
            {editingEntry && (
                <EditEntryModal
                    isOpen={!!editingEntry}
                    onClose={() => setEditingEntry(null)}
                    onSave={handleSaveEdit}
                    entry={editingEntry}
                />
            )}
            {<LoginModal
                isOpen={isLoginModalOpen}
                onClose={() => setIsLoginModalOpen(false)}
            />}

            <AddContentModal
                isOpen={isAddContentModalOpen}
                onClose={() => setIsAddContentModalOpen(false)}
                onAdd={handleAddContent}
            />

            <PublishModal
                isOpen={showPublishModal}
                isPublishing={isPublishingEntry}
                onClose={() => setShowPublishModal(false)}
                onPublish={handleConfirmPublish}
                contentTitle={(selectedEntry?.content as Content)?.title || ''}
            />

            <ScrollTopButton />
        </div>
    );
}
