import React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SelectOption {
    value: string;
    label: string;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
    label?: string;
    error?: string;
    options: SelectOption[];
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
}

const selectSizes = {
    sm: 'py-1.5 text-sm',
    md: 'py-2',
    lg: 'py-3 text-lg',
};

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(({
                                                                     className,
                                                                     label,
                                                                     error,
                                                                     options,
                                                                     size = 'md',
                                                                     fullWidth = false,
                                                                     disabled,
                                                                     id,
                                                                     ...props
                                                                 }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
        <div className={cn('relative', fullWidth ? 'w-full' : '', className)}>
            {label && (
                <label
                    htmlFor={selectId}
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                    {label}
                </label>
            )}
            <div className="relative">
                <select
                    ref={ref}
                    id={selectId}
                    className={cn(
                        'block appearance-none rounded-lg border border-gray-300 dark:border-gray-600',
                        'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100',
                        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                        'disabled:opacity-50 disabled:cursor-not-allowed',
                        'pl-4 pr-10',
                        selectSizes[size],
                        error ? 'border-red-500 focus:ring-red-500' : '',
                        fullWidth ? 'w-full' : '',
                    )}
                    disabled={disabled}
                    aria-invalid={error ? 'true' : 'false'}
                    {...props}
                >
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
            {error && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-500">{error}</p>
            )}
        </div>
    );
});

Select.displayName = 'Select';

export default Select;