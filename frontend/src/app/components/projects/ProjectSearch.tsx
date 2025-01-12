// ProjectSearch.tsx
import React from 'react';
import SearchInput from '@/components/ui/SearchInput';

interface ProjectSearchProps {
    value: string;
    onChange: (value: string) => void;
}

export const ProjectSearch: React.FC<ProjectSearchProps> = ({ value, onChange }) => (
    <SearchInput
        placeholder="Search projects..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
    />
);