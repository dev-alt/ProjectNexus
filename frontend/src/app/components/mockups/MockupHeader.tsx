// components/mockups/MockupHeader.tsx
import React from 'react';
import { Plus } from 'lucide-react';
import Button from '@/components/ui/Button';

interface MockupHeaderProps {
    onCreateNew: () => void;
}

export const MockupHeader: React.FC<MockupHeaderProps> = ({ onCreateNew }) => (
    <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Mockups & Wireframes</h1>
        <Button
            onClick={onCreateNew}
            leftIcon={<Plus className="h-4 w-4" />}
        >
            New Mockup
        </Button>
    </div>
);
