import { useState } from 'react';
import { Book, PodcastEpisode, TvShow, Movie, Uri, Content, Article } from '../../../types/content';
import { EditableContent } from '../../../types/automerge/editableContent';
import { Modal } from '../../common/Modal';
import { Form } from '../../common/Form';
import { FormInput, FormSelect } from '../../common/FormInput';
import dayjs from 'dayjs';

interface EditEntryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (updates: EditableContent, dateChanged: boolean) => void;
    entry: EditableContent;
}

const getFormData = (entry: EditableContent) => {
    const content = entry.content as Content;
    return {
        $type: entry.content.$type,
        createdAt: entry.createdAt,
        title: content.title || '',
        author: content.author?.join(', ') || '',
        datePublished: 'datePublished' in content ? content.datePublished : '',
        uri: 'uri' in content ? content.uri || '' : '',
        publisher: 'publisher' in content ? content.publisher : '',
        duration: 'duration' in content ? content.duration : '',
        episodeNumber: 'episodeNumber' in content ? String(content.episodeNumber) : '',
        seasonNumber: 'seasonNumber' in content ? String(content.seasonNumber) : '',
        seriesName: 'seriesName' in content ? content.seriesName : '',
        podcastName: 'podcastName' in content ? content.podcastName : '',
        director: 'director' in content ? content.director?.join(', ') || '' : '',
        productionCompany: 'productionCompany' in content ? content.productionCompany : '',
    }
}

export function EditEntryModal({ isOpen, onClose, onSave, entry }: EditEntryModalProps) {
    const [formData, setFormData] = useState(getFormData(entry));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const baseEntry = {
            ...entry,
            title: formData.title,
            author: formData.author ? formData.author.split(',').map(a => a.trim()) : undefined,
            datePublished: formData.datePublished || undefined,
            createdAt: formData.createdAt,
            uri: formData.uri || undefined,
        };

        let updatedEntry: EditableContent = entry;
        let dateChanged = entry.createdAt !== updatedEntry.createdAt
        if (dateChanged) {
            updatedEntry.createdAt = formData.createdAt;
        }
        switch (entry.content.$type) {
            case Book.$type:
                updatedEntry.content = {
                    ...entry.content,
                    title: formData.title,
                    author: formData.author ? formData.author.split(',').map(a => a.trim()) : [],
                    datePublished: formData.datePublished,
                    publisher: formData.publisher || '',
                } as Book.Type;
                break;
            case Movie.$type:
                updatedEntry.content = {
                    ...entry.content,
                    title: formData.title,
                    author: formData.author ? formData.author.split(',').map(a => a.trim()) : [],
                    datePublished: formData.datePublished,
                    director: formData.director?.split(',').map(d => d.trim()) || [],
                } as Movie.Type;
                break;
            case PodcastEpisode.$type:
                updatedEntry.content = {
                    ...entry.content,
                    duration: formData.duration,
                    episodeNumber: parseInt(formData.episodeNumber),
                    podcastName: formData.podcastName,
                } as PodcastEpisode.Type;
                break;
            case TvShow.$type:
                updatedEntry.content = {
                    ...entry.content,
                    title: formData.title,
                    author: formData.author ? formData.author.split(',').map(a => a.trim()) : [],
                    datePublished: formData.datePublished,
                } as TvShow.Type;
                break;
            case Uri.$type:
                updatedEntry.content = {
                    ...entry.content,
                    $type: formData.$type,
                    title: formData.title,
                    author: formData.author ? formData.author.split(',').map(a => a.trim()) : [],
                    datePublished: formData.datePublished,
                    uri: formData.uri || entry.url,
                } as Uri.Type;
                break;
            default:
                return;
        }
        onSave(updatedEntry, entry.createdAt !== updatedEntry.createdAt);
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Edit Content Entry"
            maxWidth="max-w-md"
        >
            <Form onSubmit={handleSubmit} submitLabel="Save Changes">
                <FormSelect
                    label="Type"
                    value={entry.content.$type}
                    required
                    disabled={entry.content.$type !== Uri.$type}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, $type: e.target.value })}
                >
                    <option value={Article.$type}>Article</option>
                    <option value={Book.$type}>Book</option>
                    <option value={PodcastEpisode.$type}>Podcast Episode</option>
                    <option value={TvShow.$type}>TV Show</option>
                    <option value={Movie.$type}>Movie</option>
                    <option value={Uri.$type}>URL</option>
                </FormSelect>

                {entry.content.$type && (
                    <>
                        <FormInput
                            label="Title"
                            value={formData.title}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, title: e.target.value })}
                            required={entry.content.$type !== Uri.$type}
                            optional={entry.content.$type === Uri.$type}
                        />

                        <FormInput
                            label="Author(s)"
                            value={formData.author}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, author: e.target.value })}
                            optional
                            additionalLabel="comma-separated"
                        />

                        {entry.content.$type === PodcastEpisode.$type && (
                            <>
                                <FormInput
                                    label="Podcast Name"
                                    value={formData.podcastName}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, podcastName: e.target.value })}
                                    required
                                />
                                <FormInput
                                    type="number"
                                    label="Episode Number"
                                    value={formData.episodeNumber}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, episodeNumber: e.target.value })}
                                    required
                                />
                            </>
                        )}

                        {entry.content.$type === TvShow.$type && (
                            <>
                                <FormInput
                                    label="Series Name"
                                    value={formData.title}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                />
                                <FormInput
                                    type="number"
                                    label="Season Number"
                                    value={formData.seasonNumber}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, seasonNumber: e.target.value })}
                                    required
                                />
                                <FormInput
                                    type="number"
                                    label="Episode Number"
                                    value={formData.episodeNumber}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, episodeNumber: e.target.value })}
                                    required
                                />
                            </>
                        )}

                        {entry.content.$type === Movie.$type && (
                            <>
                                <FormInput
                                    label="Director(s)"
                                    value={formData.director}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, director: e.target.value })}
                                    required
                                    additionalLabel="comma-separated"
                                />
                            </>
                        )}

                        <FormInput
                            type="url"
                            label="URL"
                            value={formData.uri}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, uri: e.target.value })}
                            required={entry.content.$type === Uri.$type}
                            optional={entry.content.$type !== Uri.$type}
                        />

                        <FormInput
                            type="date"
                            label="Date Added"
                            value={formData.createdAt ? dayjs(formData.createdAt).format('YYYY-MM-DD') : ''}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, createdAt: dayjs(e.target.value).toISOString() })}
                            optional
                        />

                        {(entry.content.$type === Uri.$type || entry.content.$type === Book.$type) && (
                            <FormInput
                                label="Publisher"
                                value={formData.publisher || ''}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, publisher: e.target.value })}
                                optional
                            />
                        )}

                        <FormInput
                            type="date"
                            label="Date Published"
                            value={formData.datePublished ? dayjs(formData.datePublished).format('YYYY-MM-DD') : ''}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, datePublished: dayjs(e.target.value).toISOString() })}
                            optional
                        />
                    </>
                )}
            </Form>
        </Modal>
    );
} 