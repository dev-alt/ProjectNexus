import React from 'react';
import { Search } from 'lucide-react';
import Input from './Input';
import { cn } from '@/lib/utils';

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    onSearch?: (value: string) => void;
    className?: string;
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(({
                                                                              onSearch,
                                                                              className,
                                                                              onChange,
                                                                              ...props
                                                                          }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (onChange) onChange(e);
        if (onSearch) onSearch(e.target.value);
    };

    return (
        <Input
            ref={ref}
            type="search"
            className={cn('pl-10', className)}
            leftIcon={<Search className="h-5 w-5" />}
            onChange={handleChange}
            {...props}
        />
    );
});

SearchInput.displayName = 'SearchInput';

export default SearchInput;