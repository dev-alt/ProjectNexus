// app/components/projects/ProjectHeader.tsx

import React from 'react';
import { Plus } from 'lucide-react';
import Button from '@/components/ui/Button';

interface ProjectHeaderProps {
    onCreateNew: () => void;
}

export const ProjectHeader: React.FC<ProjectHeaderProps> = ({ onCreateNew }) => (
    <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Projects</h1>
        <Button
            onClick={onCreateNew}
            leftIcon={<Plus className="h-4 w-4" />}
        >
            New Project
        </Button>
    </div>
);