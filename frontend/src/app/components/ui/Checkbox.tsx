import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
    label?: string;
    description?: string;
    error?: string;
    size?: 'sm' | 'md' | 'lg';
}

const checkboxSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
};

const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
};

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(({
                                                                        className,
                                                                        label,
                                                                        description,
                                                                        error,
                                                                        size = 'md',
                                                                        disabled,
                                                                        id,
                                                                        ...props
                                                                    }, ref) => {
    const checkboxId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
        <div className={cn('relative flex items-start', className)}>
            <div className="flex items-center h-5">
                <div className="relative">
                    <input
                        ref={ref}
                        id={checkboxId}
                        type="checkbox"
                        className="sr-only peer"
                        disabled={disabled}
                        aria-invalid={error ? 'true' : 'false'}
                        {...props}
                    />
                    <div
                        className={cn(
                            'border rounded',
                            'flex items-center justify-center',
                            'peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500',
                            'peer-disabled:opacity-50 peer-disabled:cursor-not-allowed',
                            'peer-checked:bg-blue-600 peer-checked:border-blue-600',
                            error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600',
                            checkboxSizes[size],
                        )}
                    >
                        <Check
                            className={cn(
                                'hidden text-white peer-checked:block',
                                iconSizes[size],
                            )}
                        />
                    </div>
                </div>
            </div>
            {(label || description) && (
                <div className="ml-3">
                    {label && (
                        <label
                            htmlFor={checkboxId}
                            className={cn(
                                'font-medium text-gray-900 dark:text-gray-100',
                                disabled && 'opacity-50 cursor-not-allowed',
                                size === 'sm' ? 'text-sm' : 'text-base',
                            )}
                        >
                            {label}
                        </label>
                    )}
                    {description && (
                        <p className={cn(
                            'text-gray-500 dark:text-gray-400',
                            disabled && 'opacity-50 cursor-not-allowed',
                            size === 'sm' ? 'text-xs' : 'text-sm',
                        )}>
                            {description}
                        </p>
                    )}
                </div>
            )}
            {error && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-500">{error}</p>
            )}
        </div>
    );
});

Checkbox.displayName = 'Checkbox';

export default Checkbox;