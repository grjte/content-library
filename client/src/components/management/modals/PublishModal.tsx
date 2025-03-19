import { useState } from "react";
import { Modal } from "../../common/Modal";
import { Form } from "../../common/Form";

interface PublishModalProps {
    isOpen: boolean;
    isPublishing: boolean;
    onClose: () => void;
    onPublish: (postToBluesky: boolean) => void;
    contentTitle: string;
}

export function PublishModal({ isOpen, isPublishing, onClose, onPublish, contentTitle }: PublishModalProps) {
    const [postToBluesky, setPostToBluesky] = useState(true);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onPublish(postToBluesky);
    };

    return (
        // TODO: add a link to the user's public profile
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`Publish "${contentTitle}" to my public profile`}
        >
            <Form
                onSubmit={handleSubmit}
                submitLabel="Publish"
                isSubmitting={isPublishing}
            >
                <label className="flex items-center space-x-3 py-2">
                    <input
                        type="checkbox"
                        id="postToBluesky"
                        checked={postToBluesky}
                        onChange={(e) => setPostToBluesky(e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">
                        Also post to my bluesky feed
                    </span>
                </label>
            </Form>
        </Modal>
    );
} 