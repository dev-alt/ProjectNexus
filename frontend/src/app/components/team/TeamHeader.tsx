// components/team/TeamHeader.tsx
import React from 'react';
import { Plus } from 'lucide-react';
import Button from '@/components/ui/Button';

interface TeamHeaderProps {
    onAddMember: () => void;
}

export const TeamHeader: React.FC<TeamHeaderProps> = ({ onAddMember }) => (
    <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Team Members</h1>
        <Button
            onClick={onAddMember}
            leftIcon={<Plus className="h-4 w-4" />}
        >
            Add Member
        </Button>
    </div>
);
