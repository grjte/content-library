import { useState } from 'react';
import { LexiconId } from '../../types/content';
import { useDebounce } from 'react-use';
import { Filters } from './Filters';

interface ControlPanelProps {
    isPublicView: boolean;
    showFilters: boolean;
    setShowFilters: (showFilters: boolean) => void;
    isEditMode: boolean;
    setIsEditMode: (isEditMode: boolean) => void;
    setIsAddModalOpen: (isAddModalOpen: boolean) => void;
    setDebouncedQuery: (debouncedQuery: string) => void;
    selectedTypes: Set<LexiconId>;
    setSelectedTypes: (selectedTypes: Set<LexiconId>) => void;
}

export function ControlPanel({
    isPublicView,
    showFilters,
    setShowFilters,
    isEditMode,
    setIsEditMode,
    setIsAddModalOpen,
    selectedTypes,
    setSelectedTypes,
    setDebouncedQuery,
}: ControlPanelProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Debounce search query by 150ms
    useDebounce(
        () => {
            setDebouncedQuery(searchQuery);
        },
        150,
        [searchQuery]
    );

    const handleFilterClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowFilters(!showFilters);
    };

    const handleEditModeClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsEditMode(!isEditMode);
    };

    const handleAddClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsAddModalOpen(true);
    };

    // Add background click handler
    const handleBackgroundClick = (e: React.MouseEvent) => {
        // Only handle clicks directly on the background
        if (e.target === e.currentTarget) {
            setShowFilters(false);
            setIsEditMode(false);
        }
    };

    const handleMenuClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <>
            {/* Desktop control panel - hidden on mobile */}
            <div className="hidden sm:flex fixed top-20 right-8 z-30 flex-col gap-3 items-end">
                {/* Search bar */}
                <div className="relative w-64 group" onClick={e => e.stopPropagation()}>
                    <input
                        type="search"
                        placeholder="Search titles & authors"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-2 bg-white/90 backdrop-blur-sm border border-stone-200 rounded-lg 
                                 shadow-lg focus:ring-2 focus:ring-stone-400 focus:outline-none
                                 group-hover:bg-white transition-all duration-200"
                    />
                    <svg
                        className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-stone-800/50"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                </div>

                {/* Control buttons */}
                <div className="flex gap-2 bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-lg 
                               border border-stone-200 hover:bg-white transition-all duration-200"
                    onClick={e => e.stopPropagation()}>
                    <button
                        className={`p-2 rounded-md hover:bg-stone-50 transition-colors duration-200
                                  ${showFilters ? 'bg-stone-100 text-stone-900' : 'text-stone-600'}`}
                        onClick={handleFilterClick}
                        aria-label="Toggle filters"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                        </svg>
                    </button>
                    {!isPublicView && (
                        <>
                            <button
                                className="p-2 rounded-md hover:bg-stone-50 text-stone-600 transition-colors duration-200"
                                onClick={handleAddClick}
                                aria-label="Add new entry"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                            </button>
                            <button
                                className={`p-2 rounded-md hover:bg-stone-50 transition-colors duration-200
                                          ${isEditMode ? 'bg-stone-100 text-stone-900' : 'text-stone-600'}`}
                                onClick={handleEditModeClick}
                                aria-label="Toggle edit mode"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Mobile controls */}
            <div className="sm:hidden">
                {/* Floating search bar */}
                <div className="fixed bottom-6 left-4 right-4 z-30" onClick={e => e.stopPropagation()}>
                    <input
                        type="search"
                        placeholder="Search titles & authors"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-2 bg-white/90 backdrop-blur-sm border border-stone-200 rounded-lg 
                                 shadow-lg focus:ring-2 focus:ring-stone-400 focus:outline-none"
                    />
                </div>

                {/* Floating menu button */}
                <button
                    onClick={handleMenuClick}
                    className="fixed bottom-20 right-4 z-30 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg 
                             border border-stone-200 text-stone-600 hover:bg-white transition-all duration-200"
                    aria-label="Menu"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>

                {/* Menu panel */}
                {isMenuOpen && (
                    <div className="fixed bottom-32 right-4 z-30 flex flex-col gap-2 p-2 bg-white/90 backdrop-blur-sm 
                                  rounded-lg shadow-lg border border-stone-200"
                        onClick={e => e.stopPropagation()}>
                        <button
                            className={`p-2 rounded-md hover:bg-stone-50 transition-colors duration-200
                                      ${showFilters ? 'bg-stone-100 text-stone-900' : 'text-stone-600'}`}
                            onClick={handleFilterClick}
                            aria-label="Toggle filters"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                            </svg>
                        </button>
                        {!isPublicView && (
                            <>
                                <button
                                    className="p-2 rounded-md hover:bg-stone-50 text-stone-600 transition-colors duration-200"
                                    onClick={handleAddClick}
                                    aria-label="Add new entry"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                </button>
                                <button
                                    className={`p-2 rounded-md hover:bg-stone-50 transition-colors duration-200
                                              ${isEditMode ? 'bg-stone-100 text-stone-900' : 'text-stone-600'}`}
                                    onClick={handleEditModeClick}
                                    aria-label="Toggle edit mode"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
                                </button>
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* Background overlay when filters are shown */}
            {showFilters && (
                <div
                    className="fixed inset-0 bg-black/20 z-10"
                    onClick={handleBackgroundClick}
                />
            )}

            {/* Filter panel */}
            {showFilters && (
                <div className="fixed top-16 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-stone-200 shadow-lg z-20">
                    <div className="max-w-7xl mx-auto py-4">
                        <Filters
                            selectedTypes={selectedTypes}
                            setSelectedTypes={setSelectedTypes}
                        />
                    </div>
                </div>
            )}
        </>
    );
}