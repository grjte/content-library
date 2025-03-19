import { Article, Book, LexiconId, Movie, Podcast, PodcastEpisode, Thread, TvShow, Uri, Video } from '../../types/content';

type FiltersProps = {
    selectedTypes: Set<LexiconId>;
    setSelectedTypes: (types: Set<LexiconId>) => void;
}

const CONTENT_TYPES: { type: LexiconId; label: string; icon: string }[] = [
    {
        type: Book.$type,
        label: 'Books',
        icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
    },
    {
        type: Movie.$type,
        label: 'Movies',
        icon: 'M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z'
    },
    {
        type: PodcastEpisode.$type,
        label: 'Podcasts',
        icon: 'M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a5 5 0 010-7.07m7.072 0a5 5 0 010 7.07M13 12a1 1 0 11-2 0 1 1 0 012 0z'
    },
    {
        type: TvShow.$type,
        label: 'TV Shows',
        icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z'
    },
    {
        type: Uri.$type,
        label: 'Links',
        icon: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1'
    },
];

const TYPE_COLORS: Record<LexiconId, { bg: string, bgHover: string, text: string }> = {
    [Book.$type]: { bg: 'bg-blue-50', bgHover: 'hover:bg-blue-100', text: 'text-blue-800' },
    [Movie.$type]: { bg: 'bg-red-50', bgHover: 'hover:bg-red-100', text: 'text-red-800' },
    [PodcastEpisode.$type]: { bg: 'bg-purple-50', bgHover: 'hover:bg-purple-100', text: 'text-purple-800' },
    [TvShow.$type]: { bg: 'bg-orange-50', bgHover: 'hover:bg-orange-100', text: 'text-orange-800' },
    [Uri.$type]: { bg: 'bg-green-50', bgHover: 'hover:bg-green-100', text: 'text-green-800' },
    // NOT DISPLAYED
    [Article.$type]: { bg: 'bg-yellow-50', bgHover: 'hover:bg-yellow-100', text: 'text-yellow-800' },
    [Podcast.$type]: { bg: 'bg-purple-50', bgHover: 'hover:bg-purple-100', text: 'text-purple-800' },
    [Thread.$type]: { bg: 'bg-gray-50', bgHover: 'hover:bg-gray-100', text: 'text-gray-800' },
    [Video.$type]: { bg: 'bg-teal-50', bgHover: 'hover:bg-teal-100', text: 'text-teal-800' },
};

export function Filters({ selectedTypes, setSelectedTypes }: FiltersProps) {
    const toggleType = (type: LexiconId) => {
        const newTypes = new Set(selectedTypes);
        if (newTypes.has(type)) {
            newTypes.delete(type);
        } else {
            newTypes.add(type);
        }
        setSelectedTypes(newTypes);
    };

    const toggleAll = () => {
        if (selectedTypes.size === CONTENT_TYPES.length) {
            setSelectedTypes(new Set());
        } else {
            setSelectedTypes(new Set(CONTENT_TYPES.map(t => t.type)));
        }
    };

    const allSelected = selectedTypes.size === CONTENT_TYPES.length;

    return (
        <div className="px-8" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-medium text-amber-900 mb-4">Filter by Type</h2>
            <div className="flex flex-wrap gap-3">
                {/* All button */}
                <button
                    onClick={toggleAll}
                    className={`
                        flex items-center gap-2 px-4 py-2 rounded-lg
                        border transition-all duration-200
                        ${allSelected
                            ? 'bg-amber-50 border-amber-200 text-amber-800 shadow-sm'
                            : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'}
                    `}
                >
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 6h16M4 12h16M4 18h16"
                        />
                    </svg>
                    <span className="font-medium">All</span>
                    {allSelected && (
                        <svg
                            className="w-4 h-4 ml-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    )}
                </button>

                {/* Type filters */}
                {CONTENT_TYPES.map(({ type, label, icon }) => {
                    const isSelected = selectedTypes.has(type);
                    const colors = TYPE_COLORS[type];

                    return (
                        <button
                            key={type}
                            onClick={() => toggleType(type)}
                            className={`
                                flex items-center gap-2 px-4 py-2 rounded-lg
                                border transition-all duration-200
                                ${isSelected
                                    ? `${colors.bg} border-${colors.text.replace('text-', '')} ${colors.text} shadow-sm`
                                    : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'}
                                ${colors.bgHover}
                            `}
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d={icon}
                                />
                            </svg>
                            <span className="font-medium">{label}</span>
                            {isSelected && (
                                <svg
                                    className="w-4 h-4 ml-1"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}