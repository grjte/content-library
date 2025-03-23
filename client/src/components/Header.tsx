import { useState, useEffect } from "react";
import { LoginModal } from "./common/LoginModal";
import { useOAuthSession } from '../context/ATProtoSessionContext';
import { useParams } from "react-router-dom";
import AtpAgent, { Agent } from "@atproto/api";

type HeaderProps = {
    isPublicView: boolean;
}

export function Header({
    isPublicView,
}: HeaderProps) {
    // did or handle of account to show profile for
    const { did } = useParams();
    const decodedDid = did ? decodeURIComponent(did) : '';
    const [profile, setProfile] = useState<any | null>(null)
    const session = useOAuthSession();

    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

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