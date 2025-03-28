import { useState } from 'react';
import { Book, PodcastEpisode, TvShow, Movie, Uri, Content, LexiconId, Podcast } from '../../../types/content'
import { searchContent, getUrlContent } from '../../../api/content';
import { BookSearchResults } from '../searchResults/BookSearchResults';
import { OmdbSearchResults } from '../searchResults/OmdbSearchResults';
import { PodcastSearchResults } from '../searchResults/PodcastSearchResults';
import { Modal } from '../../common/Modal';
import { Form } from '../../common/Form';
import { FormInput } from '../../common/FormInput';

interface AddContentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (content: Content) => void;
}

export function AddContentModal({ isOpen, onClose, onAdd }: AddContentModalProps) {
    const [searchType, setSearchType] = useState<LexiconId>(Uri.$type);
    const [urlInput, setUrlInput] = useState('');
    const [urlTitle, setUrlTitle] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<Content[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = async (e: React.FormEvent) => {
        try {
            e.preventDefault();
            if (!searchQuery && searchType !== Uri.$type) {
                return;
            }
            setError(null);
            setIsLoading(true);
            setSearchResults([]);
            if (searchType === Uri.$type) {
                await handleUrl();
            } else {
                const results = await searchContent(searchType, searchQuery);
                setSearchResults(results);
            }
        } catch (err) {
            setError('Failed to process request. Please try again.');
            console.error('Error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUrl = async () => {
        try {
            const content = await getUrlContent(urlInput, urlTitle);
            handleContentSelect(content);
        }
        catch (err) {
            const content = {
                $type: Uri.$type,
                title: urlTitle || urlInput,
                uri: urlInput
            } as Uri.Type;
            handleContentSelect(content);
        }

        resetForm();
        onClose();
    }

    const resetForm = () => {
        setError(null);
        setUrlInput('');
        setUrlTitle('');
        setSearchType(Uri.$type);
        setSearchQuery('');
        setSearchResults([]);
    }

    const handleSelectContentType = (e: React.ChangeEvent<HTMLInputElement>) => {
        resetForm()
        setSearchType(e.target.value as LexiconId);
    }

    const handleContentSelect = (content: Content) => {
        onAdd(content);
        resetForm();
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={() => { resetForm(); onClose() }}
            title="Add New Content"
        >
            <Form
                onSubmit={handleSearch}
                isSubmitting={isLoading}
            >
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Content Type
                    </label>
                    <div className="flex flex-row justify-between">
                        <label>
                            <input
                                type="radio"
                                value={Book.$type}
                                checked={searchType === Book.$type}
                                onChange={handleSelectContentType}
                                className=" text-blue-500"
                            />
                            <span className="ml-2">Book</span>
                        </label>
                        <label>
                            <input
                                type="radio"
                                value={PodcastEpisode.$type}
                                checked={searchType === PodcastEpisode.$type}
                                onChange={handleSelectContentType}
                                className="text-blue-500"
                            />
                            <span className="ml-2">Podcast Episode</span>
                        </label>
                        <label >
                            <input
                                type="radio"
                                value={TvShow.$type}
                                checked={searchType === TvShow.$type}
                                onChange={handleSelectContentType}
                                className="text-blue-500"
                            />
                            <span className="ml-2">TV Show</span>
                        </label>
                        <label>
                            <input
                                type="radio"
                                value={Movie.$type}
                                checked={searchType === Movie.$type}
                                onChange={handleSelectContentType}
                                className="text-blue-500"
                            />
                            <span className="ml-2">Movie</span>
                        </label>
                        <label>
                            <input
                                type="radio"
                                value={Uri.$type}
                                checked={searchType === Uri.$type}
                                onChange={handleSelectContentType}
                                className="text-blue-500"
                            />
                            <span className="ml-2">URL</span>
                        </label>
                    </div>
                </div>

                {searchType === Uri.$type ? (
                    <>
                        <FormInput
                            type="url"
                            label="URL"
                            value={urlInput}
                            onChange={(e) => setUrlInput(e.target.value)}
                            required
                            placeholder="https://example.com"
                        />
                        <FormInput
                            label="Title"
                            value={urlTitle}
                            onChange={(e) => setUrlTitle(e.target.value)}
                            optional
                            placeholder="Enter title"
                        />
                    </>
                ) : (
                    <FormInput
                        label={searchType === Book.$type ? 'Search by title or author' : searchType === PodcastEpisode.$type ? 'Search by podcast name' : searchType === TvShow.$type ? 'Search by tv series name' : searchType === Movie.$type ? 'Search by movie title' : 'Search by title'}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        required
                        placeholder={(searchType === Book.$type) ? 'Enter title or author'
                            : searchType === PodcastEpisode.$type ? 'Enter name of podcast'
                                : searchType === TvShow.$type ? 'Enter name of tv series'
                                    : searchType === Movie.$type ? 'Enter movie title'
                                        : 'Enter title'}
                    />
                )}

                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                        {error}
                    </div>
                )}

                <div className="mt-4" onClick={(e) => e.stopPropagation()}>
                    {searchResults.length > 0 && (
                        <div className="space-y-4">
                            {(searchType === Book.$type) && (
                                <BookSearchResults
                                    results={searchResults as Book.Type[]}
                                    onSelect={handleContentSelect}
                                    isLoading={isLoading}
                                />
                            )}
                            {(searchType === Movie.$type || searchType === TvShow.$type) && (
                                <OmdbSearchResults
                                    contentType={searchType}
                                    results={searchResults as (Movie.Type | TvShow.Type)[]}
                                    onSelect={handleContentSelect}
                                    isLoading={isLoading}
                                />
                            )}
                            {searchType === PodcastEpisode.$type && (
                                <PodcastSearchResults
                                    results={searchResults as Podcast.Type[]}
                                    onSelect={handleContentSelect}
                                    isLoading={isLoading}
                                />
                            )}
                        </div>
                    )}
                </div>
            </Form>
        </Modal>
    );
}