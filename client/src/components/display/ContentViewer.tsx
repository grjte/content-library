import { useState, useEffect, useMemo } from 'react';
import { Content, LexiconId, DisplayContent, Book, Movie, PodcastEpisode, TvShow, Uri } from '../../types/content';
import { Header } from '../Header';
import { ScrollTopButton } from './ScrollTopButton';
import { useParams } from 'react-router-dom';
import { getPublicEntries } from '../../api/entries';
import dayjs from 'dayjs';
import { ContentEntry } from './ContentEntry';
import { ControlPanel } from './ControlPanel';

export function ContentViewer() {
    const { did } = useParams();
    const decodedDid = did ? decodeURIComponent(did) : '';

    // TODO: deal with pagination
    const [entries, setEntries] = useState<DisplayContent[]>([]);
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [selectedTypes, setSelectedTypes] = useState<Set<LexiconId>>(
        new Set([Book.$type, Movie.$type, PodcastEpisode.$type, TvShow.$type, Uri.$type])
    );

    // Load all content documents when the page being viewed changes
    useEffect(() => {
        getPublicEntries(decodedDid).then(setEntries)
    }, [decodedDid])

    const filteredEntries = useMemo(() => {
        return entries.filter(entry => {
            const matchesType = selectedTypes.has(entry.content.$type as LexiconId);

            const searchTerm = debouncedQuery.toLowerCase();
            const matchesSearch = searchTerm === '' ||
                (entry.content as Content).title?.toLowerCase().includes(searchTerm) ||
                (entry.content as Content).author?.some(author =>
                    author.toLowerCase().includes(searchTerm)
                );

            return matchesType && matchesSearch;
        });
    }, [entries, selectedTypes, debouncedQuery])

    // Group entries by date
    const groupedEntries = useMemo(() => {
        const groups = filteredEntries.reduce((acc, entry) => {
            const dateKey = entry.createdAt.substring(0, 10); // YYYY-MM-DD
            if (!acc[dateKey]) {
                acc[dateKey] = [];
            }
            acc[dateKey].push(entry);
            return acc;
        }, {} as Record<string, DisplayContent[]>);

        // Sort entries within each date
        Object.values(groups).forEach(entries => {
            entries.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
        });

        // Sort dates
        return Object.entries(groups)
            .sort(([a], [b]) => b.localeCompare(a))
            .map(([date, entries]) => ({
                date,
                label: dayjs(date).format('MMM D, YYYY'),
                entries
            }));
    }, [filteredEntries]);

    try {
        return (
            <div onClick={() => setShowFilters(false)}>
                <Header
                    isPublicView={true}
                />

                <ControlPanel
                    isPublicView={true}
                    showFilters={showFilters}
                    setShowFilters={setShowFilters}
                    isEditMode={false}
                    setIsEditMode={() => { }}
                    setIsAddModalOpen={() => { }}
                    selectedTypes={selectedTypes}
                    setSelectedTypes={setSelectedTypes}
                    setDebouncedQuery={setDebouncedQuery}
                />

                <>
                    <div className="pt-24 pb-20 bg-gray-50 min-h-screen">
                        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                            {groupedEntries.map(({ date, label, entries }) => (
                                <div key={date} className="mb-12">
                                    <div
                                        id={`date-${date}`}
                                        className="mb-4 ml-2 border-b border-gray-200 pb-1"
                                    >
                                        <h2 className="text-sm text-gray-400 uppercase tracking-wider font-medium">{label}</h2>
                                    </div>
                                    {entries.map((entry) => (
                                        <div key={entry.id} className="relative w-full mb-4">
                                            {/* Desktop and Tablet View (hidden on mobile) */}
                                            <div className="hidden sm:block relative w-full">
                                                {/* Main card taking full width */}
                                                <div className="w-full bg-white border border-gray-200 rounded-md shadow-sm transition-shadow duration-200 hover:shadow-lg relative">
                                                    <div className="px-4 py-5">
                                                        <ContentEntry entry={entry.content as Content} />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Mobile View (hidden on tablet and desktop) */}
                                            <div className="sm:hidden w-full">
                                                <div className="flex items-center">
                                                    <ContentEntry entry={entry.content as Content} isMobile={true} />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </>

                <ScrollTopButton />
            </div >
        );
    } catch (error) {
        console.error(error);
        return <div>Error loading content</div>;
    }
}