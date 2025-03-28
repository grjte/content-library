import { useState } from 'react';
import { Podcast, PodcastEpisode } from '../../../types/content';
import { getPodcastEpisodes } from '../../../api/content'

interface PodcastSearchResultsProps {
    results: Podcast.Type[];
    onSelect: (episode: PodcastEpisode.Type) => void;
    isLoading: boolean;
}

export function PodcastSearchResults({ results, onSelect, isLoading }: PodcastSearchResultsProps) {
    const [selectedPodcast, setSelectedPodcast] = useState<Podcast.Type | null>(null);
    const [episodes, setEpisodes] = useState<PodcastEpisode.Type[]>([]);
    const [isLoadingEpisodes, setIsLoadingEpisodes] = useState(false);

    const handlePodcastSelect = async (podcast: Podcast.Type) => {
        setIsLoadingEpisodes(true);
        setSelectedPodcast(podcast);
        try {
            const episodes = await getPodcastEpisodes(podcast.podcastIndexId);
            episodes.map((episode: PodcastEpisode.Type) => {
                episode.podcastName = podcast.title;
                episode.author = podcast.author;
                if (!episode.thumbnailUrl && podcast.thumbnailUrl) {
                    episode.thumbnailUrl = podcast.thumbnailUrl;
                }
            });
            setEpisodes(episodes);
        } catch (error) {
            console.error('Error fetching episodes:', error);
        } finally {
            setIsLoadingEpisodes(false);
        }
    };

    if (isLoading) {
        return <div className="flex justify-center p-4"><div className="loader"></div></div>;
    }

    if (selectedPodcast) {
        return (
            <div className="space-y-4">
                <button
                    onClick={() => setSelectedPodcast(null)}
                    className="text-blue-500 hover:text-blue-600 flex items-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to podcasts
                </button>

                <h2 className="text-xl font-semibold">{selectedPodcast.title} - Episodes</h2>

                {isLoadingEpisodes ? (
                    <div className="flex justify-center p-4"><div className="loader"></div></div>
                ) : (
                    <div className="space-y-4">
                        {episodes.map((episode, i) => (
                            <div key={`episode-${i}`} className="p-4 border rounded-md hover:bg-gray-50 flex gap-4">
                                {episode.thumbnailUrl && (
                                    <img
                                        src={episode.thumbnailUrl}
                                        alt={episode.title}
                                        className="w-24 h-24 object-cover rounded"
                                    />
                                )}
                                <div className="flex-1">
                                    <h3 className="font-medium">{episode.title}</h3>
                                    <p className="text-gray-600 line-clamp-2">{episode.description}</p>
                                </div>
                                <button
                                    onClick={(e) => { e.preventDefault(); onSelect(episode) }}
                                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 h-fit"
                                >
                                    Add
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {results.map((podcast) => (
                <div key={podcast.podcastIndexId} className="p-4 border rounded-md hover:bg-gray-50 flex gap-4">
                    {podcast.thumbnailUrl && (
                        <img
                            src={podcast.thumbnailUrl}
                            alt={podcast.title}
                            className="w-24 h-24 object-cover rounded"
                        />
                    )}
                    <div className="flex-1">
                        <h3 className="font-medium">{podcast.title}</h3>
                        <p className="text-gray-500">by {podcast.author}</p>
                        <p className="text-gray-600 line-clamp-2">{podcast.description}</p>
                    </div>
                    <button
                        onClick={() => handlePodcastSelect(podcast)}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 h-fit"
                    >
                        View Episodes
                    </button>
                </div>
            ))}
        </div>
    );
} 