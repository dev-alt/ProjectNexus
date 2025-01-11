import React from 'react';
import { cn } from '@/lib/utils';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    fullWidth?: boolean;
    resizable?: boolean;
}

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(({
                                                                           className,
                                                                           label,
                                                                           error,
                                                                           fullWidth = false,
                                                                           resizable = true,
                                                                           disabled,
                                                                           id,
                                                                           rows = 4,
                                                                           ...props
                                                                       }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
        <div className={cn('relative', fullWidth ? 'w-full' : '', className)}>
            {label && (
                <label
                    htmlFor={textareaId}
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                    {label}
                </label>
            )}
            <textarea
                ref={ref}
                id={textareaId}
                rows={rows}
                className={cn(
                    'block rounded-lg border border-gray-300 dark:border-gray-600',
                    'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100',
                    'placeholder-gray-400 dark:placeholder-gray-500',
                    'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                    'px-4 py-2',
                    !resizable && 'resize-none',
                    error ? 'border-red-500 focus:ring-red-500' : '',
                    fullWidth ? 'w-full' : '',
                )}
                disabled={disabled}
                aria-invalid={error ? 'true' : 'false'}
                {...props}
            />
            {error && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-500">{error}</p>
            )}
        </div>
    );
});

TextArea.displayName = 'TextArea';

export default TextArea;