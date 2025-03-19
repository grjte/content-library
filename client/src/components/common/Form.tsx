import React from 'react';

interface FormProps {
    onSubmit: (e: React.FormEvent) => void;
    children: React.ReactNode;
    submitLabel?: string;
    isSubmitting?: boolean;
    showSubmit?: boolean;
}

export function Form({
    onSubmit,
    children,
    submitLabel = "Submit",
    isSubmitting = false,
    showSubmit = true
}: FormProps) {
    return (
        <form onSubmit={onSubmit} className="space-y-4">
            {children}
            {showSubmit && (
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300"
                >
                    {isSubmitting ? 'Processing...' : submitLabel}
                </button>
            )}
        </form>
    );
} 