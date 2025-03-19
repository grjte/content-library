import { useCallback, useState } from 'react';
import { Modal } from './Modal';
import { Form } from './Form';
import { FormInput } from './FormInput';
import { useOAuthClient } from '../../context/ATProtoSessionContext';

type LoginModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
    const [handle, setHandle] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const client = useOAuthClient();

    const handleLogin = useCallback(async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            if (!handle.trim()) {
                throw new Error('Please enter a handle')
            }
            setIsLoading(true)
            setError(null)
            await client.signInPopup(handle)
            setIsLoading(false)
            onClose()
        } catch (err) {
            console.error('Login error:', err)
            setError(err instanceof Error ? err.message : 'Failed to login')
            setIsLoading(false)
        }
    }, [client, handle])

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Login with Bluesky"
            maxWidth="max-w-md"
        >
            {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                    {error}
                </div>
            )}
            <Form
                onSubmit={handleLogin}
                submitLabel={isLoading ? 'Connecting...' : 'Connect Account'}
                isSubmitting={isLoading}
            >
                <FormInput
                    type="text"
                    label="Bluesky Handle"
                    value={handle}
                    onChange={(e) => setHandle(e.target.value)}
                    placeholder="e.g. alice.bsky.social"
                    required
                />
            </Form>
        </Modal>
    );
} 