import { useMemo } from "react";
import { Content } from "../../types/content";
import { EditableContent } from "../../types/automerge/editableContent";
import { ContentEntry } from "../display/ContentEntry";
import dayjs from "dayjs";

type EditableContentEntriesProps = {
    filteredEntries: EditableContent[];
    isPublicView?: boolean;
    isEditMode?: boolean;
    isPublishingEntry?: boolean;
    handleEdit?: (entry: EditableContent) => void;
    handleDelete?: (entry: EditableContent) => Promise<void>;
    handlePublishClick?: (entry: EditableContent) => void;
}

export function EditableContentEntries({
    filteredEntries,
    isPublicView,
    isEditMode,
    isPublishingEntry,
    handleEdit,
    handleDelete,
    handlePublishClick
}: EditableContentEntriesProps) {

    // Group entries by date
    const groupedEntries = useMemo(() => {
        const groups = filteredEntries.reduce((acc, entry) => {
            const dateKey = entry.createdAt.substring(0, 10); // YYYY-MM-DD
            if (!acc[dateKey]) {
                acc[dateKey] = [];
            }
            acc[dateKey].push(entry);
            return acc;
        }, {} as Record<string, EditableContent[]>);

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

    return (
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
                                            {/* Publish button overlaid */}
                                            {!isPublicView && (
                                                <div className="absolute -top-2 -right-2 z-10">
                                                    {!entry.isPublic ? (
                                                        <button
                                                            onClick={() => handlePublishClick?.(entry)}
                                                            disabled={isPublishingEntry}
                                                            className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium rounded-md px-2 py-1 focus:outline-none shadow-md transition-colors duration-200 cursor-pointer"
                                                        >
                                                            publish
                                                        </button>
                                                    ) : (
                                                        <a
                                                            href={`${import.meta.env.VITE_APP_URL}/${entry.publishedBy}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="block"
                                                        >
                                                            <div className="bg-green-500 text-white text-xs font-medium rounded-md px-2 py-1 focus:outline-none shadow-md transition-colors duration-200 cursor-pointer">
                                                                {"public"}
                                                            </div>
                                                        </a>
                                                    )}
                                                </div>
                                            )}
                                            <div className="px-4 py-5">
                                                <ContentEntry entry={entry.content as Content} />
                                            </div>
                                        </div>

                                        {/* Edit mode buttons */}
                                        {!isPublicView && isEditMode && (
                                            <div className="absolute -right-12 top-1/2 -translate-y-1/2 flex flex-col gap-2">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleEdit?.(entry)
                                                    }}
                                                    className="text-gray-500 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100"
                                                >
                                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDelete?.(entry);
                                                    }}
                                                    className="text-gray-500 hover:text-red-600 p-1.5 rounded-full hover:bg-gray-100"
                                                >
                                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {/* Mobile View (hidden on tablet and desktop) */}
                                    <div className="sm:hidden w-full ">
                                        <div className="flex items-center">
                                            <ContentEntry entry={entry.content as Content} isMobile={true} />
                                            {!isPublicView && (
                                                <div className="shrink-0 pl-3 border-gray-200 flex items-center justify-center">
                                                    {!entry.isPublic ? (
                                                        <button
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                handlePublishClick?.(entry);
                                                            }}
                                                            disabled={isPublishingEntry}
                                                            className="text-blue-500 hover:text-blue-600 flex items-center"
                                                        >
                                                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                        </button>
                                                    ) : (
                                                        <a
                                                            href={`${import.meta.env.VITE_APP_URL}/${entry.publishedBy}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="block"
                                                        >
                                                            <div className="flex items-center">
                                                                <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                </svg>
                                                            </div>
                                                        </a>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}