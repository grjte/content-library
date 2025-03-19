import React, { useEffect } from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    maxWidth?: string;
}

export function Modal({
    isOpen,
    onClose,
    title,
    children,
    maxWidth = "max-w-2xl"
}: ModalProps) {
    useEffect(() => {
        const handleEscapeKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscapeKey);

        return () => {
            document.removeEventListener('keydown', handleEscapeKey);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className={`bg-white p-6 rounded-lg w-full ${maxWidth} max-h-[90vh] overflow-y-auto shadow-xl`}>
                <h2 className="text-xl font-bold mb-6">{title}</h2>
                <div className="mb-6">
                    {children}
                </div>
            </div>
        </div>
    );
} 