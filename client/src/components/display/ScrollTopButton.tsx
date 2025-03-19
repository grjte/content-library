import { useEffect, useState } from "react";

export function ScrollTopButton() {
    const [showScrollTop, setShowScrollTop] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 200);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return <>
        {showScrollTop && <button
            onClick={scrollToTop}
            className="fixed bottom-20 right-4 p-3 bg-white/90 backdrop-blur-sm rounded-full 
                 shadow-lg border border-stone-200 text-stone-600 
                 hover:bg-white hover:text-stone-900 transition-all duration-200 z-30"
            aria-label="Scroll to top"
        >
            <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 10l7-7m0 0l7 7m-7-7v18"
                />
            </svg>
        </button>}
    </>
}