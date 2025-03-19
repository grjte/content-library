import { useState, useEffect } from "react";
import { LexiconId } from "../types/content";
import { Filters } from "./display/Filters";
import { useDebounce } from "react-use";
import { LoginModal } from "./common/LoginModal";
import { useOAuthSession } from '../context/ATProtoSessionContext';
import { useParams } from "react-router-dom";
import AtpAgent, { Agent } from "@atproto/api";

type HeaderProps = {
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

export function Header({
    isPublicView,
    showFilters,
    setShowFilters,
    isEditMode,
    setIsEditMode,
    setIsAddModalOpen,
    selectedTypes,
    setSelectedTypes,
    setDebouncedQuery,
}: HeaderProps) {
    // did or handle of account to show profile for
    const { did } = useParams();
    const decodedDid = did ? decodeURIComponent(did) : '';
    const [profile, setProfile] = useState<any | null>(null)
    const session = useOAuthSession();

    const [searchQuery, setSearchQuery] = useState('');
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const getProfile = async (agent: Agent, did: string) => {
            try {
                const response = await agent.app.bsky.actor.getProfile({ actor: did })
                setProfile(response?.data)
            } catch (error) {
                console.error('error getting profile: ', error)
            }
        }
        if (session) {
            const agent = new Agent(session);
            if (did) {
                getProfile(agent, decodedDid)
            } else {
                getProfile(agent, session.did)
            }
        } else if (did) {
            const agent = new AtpAgent({
                service: import.meta.env.VITE_PUBLIC_BLUESKY_APPVIEW_API_URL
            })
            getProfile(agent, decodedDid)
        }
    }, [did])

    const handleLogout = async () => {
        if (session) {
            await session.signOut()
            // TODO: This forces the session state to update; do it better
            window.location.reload()
        }
    };

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
            <div className="fixed top-0 left-0 right-0 bg-gradient-to-b from-stone-900 to-stone-800 shadow-lg z-40">
                <div className="max-w-7xl mx-auto">
                    {/* Main header row */}
                    <div className="flex justify-between items-center px-8 py-4 border-b border-stone-700">
                        <h1 className="text-2xl font-serif text-stone-50">{import.meta.env.VITE_APP_NAME}</h1>

                        {/* Desktop profile display */}
                        {isPublicView ? (
                            <div className="absolute left-1/2 -translate-x-1/2 hidden sm:flex items-center gap-3">
                                <div className="text-stone-400 text-sm font-serif">
                                    {`the collection of`}
                                </div>
                                {profile?.avatar && (
                                    <img
                                        src={profile.avatar}
                                        alt="Profile Avatar"
                                        className="w-8 h-8 rounded-full border-2 border-stone-400"
                                    />
                                )}
                                <div className="text-stone-400 text-sm font-serif">
                                    <span className="text-stone-200">
                                        {profile?.displayName || profile?.handle}
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <div className="absolute left-1/2 -translate-x-1/2 hidden sm:block text-stone-400 text-sm font-serif">
                                private collection
                            </div>
                        )}

                        <div className="flex items-center gap-4">
                            {session ? (
                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-2 bg-stone-800 text-stone-200 rounded border border-stone-600 
                                     hover:bg-stone-700 transition-colors duration-200 text-sm font-medium"
                                >
                                    Logout
                                </button>
                            ) : (
                                <button
                                    onClick={() => setIsLoginModalOpen(true)}
                                    className="px-4 py-2 bg-stone-100 text-stone-900 rounded border border-stone-300 
                                     hover:bg-white transition-colors duration-200 text-sm font-medium"
                                >
                                    Login
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Mobile subheader row */}
                    {isPublicView ? (
                        <div className="sm:hidden px-8 py-3 border-b border-stone-700 bg-stone-800/50">
                            <div className="flex items-center justify-center gap-2 text-center">
                                <div className="text-stone-400 text-sm font-serif">
                                    {`the collection of`}
                                </div>
                                {profile?.avatar && (
                                    <img
                                        src={profile.avatar}
                                        alt="Profile Avatar"
                                        className="w-6 h-6 rounded-full border-2 border-stone-400"
                                    />
                                )}
                                <div className="text-stone-200 text-sm font-serif">
                                    {profile?.displayName || profile?.handle}
                                </div>
                            </div>
                        </div>
                    ) :
                        <div className="sm:hidden px-8 py-3 border-b border-stone-700 bg-stone-800/50 text-stone-400 text-sm font-serif text-center">
                            private collection
                        </div>
                    }
                </div>
            </div>

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

            <LoginModal
                isOpen={isLoginModalOpen}
                onClose={() => {
                    // TODO: This forces the session state to update; do it better
                    window.location.reload()
                    setIsLoginModalOpen(false)
                }}
            />
        </>
    );
}