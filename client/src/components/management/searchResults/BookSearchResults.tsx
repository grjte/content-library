import * as Book from '../../../types/lexicon/book';

interface BookSearchResultsProps {
    results: Book.Type[];
    onSelect: (result: Book.Type) => void;
    isLoading: boolean;
}

export function BookSearchResults({ results, onSelect, isLoading }: BookSearchResultsProps) {
    if (isLoading) {
        return <div className="flex justify-center p-4"><div className="loader"></div></div>;
    }

    return (
        <div className="space-y-4">
            {results.map((book, i) => (
                <div key={`book_${i}`} className="p-4 border rounded-md hover:bg-gray-50 flex gap-4">
                    {book.thumbnailUrl && (
                        <img
                            src={book.thumbnailUrl}
                            alt={book.title}
                            className="w-24 h-36 object-cover"
                        />
                    )}
                    <div className="flex-1">
                        <h3 className="font-medium">{book.title}</h3>
                        {book.author && (
                            <p className="text-gray-600">by {book.author.join(', ')}</p>
                        )}
                        {book.datePublished && (
                            <p className="text-gray-500">First published: {book.datePublished}</p>
                        )}
                    </div>
                    <button
                        type="button"
                        onClick={(e) => { e.preventDefault(); onSelect(book) }}
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 h-fit"
                    >
                        Add
                    </button>
                </div>
            ))}
        </div>
    );
} 