import React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    fullWidth?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({
                                                                  className,
                                                                  label,
                                                                  error,
                                                                  leftIcon,
                                                                  rightIcon,
                                                                  fullWidth = false,
                                                                  disabled,
                                                                  id,
                                                                  ...props
                                                              }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
        <div className={cn('relative', fullWidth ? 'w-full' : '', className)}>
            {label && (
                <label
                    htmlFor={inputId}
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                    {label}
                </label>
            )}
            <div className="relative">
                {leftIcon && (
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        {leftIcon}
                    </div>
                )}
                <input
                    ref={ref}
                    id={inputId}
                    className={cn(
                        'block rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800',
                        'text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500',
                        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                        'disabled:opacity-50 disabled:cursor-not-allowed',
                        leftIcon ? 'pl-10' : 'pl-4',
                        rightIcon ? 'pr-10' : 'pr-4',
                        'py-2',
                        error ? 'border-red-500 focus:ring-red-500' : '',
                        fullWidth ? 'w-full' : '',
                    )}
                    disabled={disabled}
                    aria-invalid={error ? 'true' : 'false'}
                    {...props}
                />
                {rightIcon && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        {rightIcon}
                    </div>
                )}
            </div>
            {error && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-500">{error}</p>
            )}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;