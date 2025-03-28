import { Movie, TvShow } from '../../../types/content';
import { getOmdbRecord } from '../../../api/content'

interface OmdbSearchResultsProps {
    isLoading: boolean;
    contentType: typeof Movie.$type | typeof TvShow.$type,
    results: (Movie.Type | TvShow.Type)[];
    onSelect: (result: Movie.Type | TvShow.Type) => void;
}

export function OmdbSearchResults({ isLoading, contentType, results, onSelect }: OmdbSearchResultsProps) {
    if (isLoading) {
        return <div className="flex justify-center p-4"><div className="loader"></div></div>;
    }

    const handleSelect = async (omdbResult: Movie.Type | TvShow.Type) => {
        try {
            if (!omdbResult.imdbId) {
                throw new Error(`IMDB id is missing from ${Movie.$type === contentType ? "movie" : "tv show"} search result`)
            }
            const record = await getOmdbRecord(contentType, omdbResult.imdbId);
            onSelect(record)
        } catch (error) {
            console.error('Error fetching episodes:', error);
        }
    };

    return (
        <div className="space-y-4">
            {results.map((omdbResult) => (
                <div key={omdbResult.imdbId} className="p-4 border rounded-md hover:bg-gray-50 flex gap-4">
                    {omdbResult.thumbnailUrl && (
                        <img
                            src={omdbResult.thumbnailUrl}
                            alt={omdbResult.title}
                            className="w-24 h-36 object-cover"
                        />
                    )}
                    <div className="flex-1">
                        <h3 className="font-medium">{omdbResult.title}</h3>
                        <p className="text-gray-500">Year: {omdbResult.datePublished}</p>
                    </div>
                    <button
                        onClick={(e) => { e.preventDefault(); handleSelect(omdbResult as Movie.Type | TvShow.Type) }}
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 h-fit"
                    >
                        Add
                    </button>
                </div>
            ))}
        </div>
    );
} 