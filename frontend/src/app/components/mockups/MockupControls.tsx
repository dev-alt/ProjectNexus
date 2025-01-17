// components/mockups/MockupControls.tsx
import React from 'react';
import { Search, LayoutGrid, Rows } from 'lucide-react';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import type { MockupFilterType } from './constants';

interface MockupControlsProps {
    searchQuery: string;
    selectedType: MockupFilterType;
    viewMode: 'grid' | 'list';
    onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onTypeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    onViewModeChange: (mode: 'grid' | 'list') => void;
    mockupTypes: ReadonlyArray<MockupFilterType>;
}

export const MockupControls: React.FC<MockupControlsProps> = ({
                                                                  searchQuery,
                                                                  selectedType,
                                                                  viewMode,
                                                                  onSearchChange,
                                                                  onTypeChange,
                                                                  onViewModeChange,
                                                                  mockupTypes,
                                                              }) => (
    <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-grow">
            <Input
                placeholder="Search mockups..."
                value={searchQuery}
                onChange={onSearchChange}
                leftIcon={<Search className="h-5 w-5" />}
                fullWidth
            />
        </div>
        <div className="flex gap-2">
            <Select
                value={selectedType}
                onChange={onTypeChange}
                options={mockupTypes.map(type => ({ value: type, label: type }))}
            />
            <div className="flex border border-gray-300 rounded-lg">
                <button
                    className={`px-3 py-2 rounded-l-lg ${
                        viewMode === 'grid' ? 'bg-gray-100' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => onViewModeChange('grid')}
                >
                    <LayoutGrid className="h-5 w-5 text-gray-500" />
                </button>
                <button
                    className={`px-3 py-2 rounded-r-lg ${
                        viewMode === 'list' ? 'bg-gray-100' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => onViewModeChange('list')}
                >
                    <Rows className="h-5 w-5 text-gray-500" />
                </button>
            </div>
        </div>
    </div>
);
