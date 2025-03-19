import React from 'react';

interface FormInputProps {
    type?: 'text' | 'url' | 'date' | 'number';
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
    optional?: boolean;
    placeholder?: string;
    disabled?: boolean;
    additionalLabel?: string;
}

interface FormSelectProps {
    label: string;
    value: string;
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    required?: boolean;
    disabled?: boolean;
    children: React.ReactNode;
}

interface FormTextAreaProps {
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    rows?: number;
    placeholder?: string;
    required?: boolean;
    optional?: boolean;
}

export function FormInput({
    type = 'text',
    label,
    value,
    onChange,
    required = false,
    optional = false,
    placeholder,
    disabled = false,
    additionalLabel,
}: FormInputProps) {
    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}
                {required && <span className="text-red-500">*</span>}
                {optional && <span className="text-gray-500 text-sm ml-2">(optional)</span>}
                {additionalLabel && <span className="text-gray-500 text-sm ml-2">({additionalLabel})</span>}
            </label>
            <input
                type={type}
                value={value}
                onChange={onChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder={placeholder}
                required={required}
                disabled={disabled}
            />
        </div>
    );
}

export function FormSelect({
    label,
    value,
    onChange,
    required = false,
    disabled = false,
    children
}: FormSelectProps) {
    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}
                {required && <span className="text-red-500">*</span>}
            </label>
            <select
                value={value}
                onChange={onChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required={required}
                disabled={disabled}
            >
                {children}
            </select>
        </div>
    );
}

export function FormTextArea({
    label,
    value,
    onChange,
    rows = 3,
    placeholder,
    required = false,
    optional = false,
}: FormTextAreaProps) {
    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}
                {required && <span className="text-red-500">*</span>}
                {optional && <span className="text-gray-500 text-sm ml-2">(optional)</span>}
            </label>
            <textarea
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                rows={rows}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
            />
        </div>
    );
} 