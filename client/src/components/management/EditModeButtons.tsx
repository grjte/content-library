import { Content } from "../../types/content";

type EditModeButtonsProps = {
    handleEdit: (entry: Content) => void;
    handleDelete: (entry: Content) => void;
    entry: Content;
}

export function EditModeButtons({ handleEdit, handleDelete, entry }: EditModeButtonsProps) {
    return (
        <div className="flex ml-4">
            <button
                onClick={() => handleEdit(entry)}
                className="p-2 hover:bg-gray-100  hover:cursor-pointer rounded-full"
                aria-label="Edit entry"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
            </button>
            <button
                onClick={() => handleDelete(entry)}
                className="p-2 hover:bg-gray-100 hover:cursor-pointer rounded-full text-red-600"
                aria-label="Delete entry"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            </button>
        </div>
    );
}