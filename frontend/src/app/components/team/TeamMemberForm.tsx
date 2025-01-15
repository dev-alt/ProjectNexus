import React, { useState } from 'react';
import { X } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { TeamMember, TeamMemberRole, TeamMemberStatus } from '@/types/team';

interface TeamMemberFormProps {
    member?: TeamMember;
    onSubmit: (data: { email?: string; role?: TeamMemberRole; status?: TeamMemberStatus }) => Promise<void>;
    onClose: () => void;
    isLoading?: boolean;
}

interface FormData {
    email?: string;
    role: TeamMemberRole;
    status: TeamMemberStatus;
}

const roles: { value: TeamMemberRole; label: string }[] = [
    { value: 'owner', label: 'Owner' },
    { value: 'member', label: 'Member' },
    { value: 'viewer', label: 'Viewer' },
];

const statuses: { value: TeamMemberStatus; label: string }[] = [
    { value: 'Active', label: 'Active' },
    { value: 'Away', label: 'Away' },
    { value: 'Offline', label: 'Offline' },
];

export const TeamMemberForm: React.FC<TeamMemberFormProps> = ({
                                                                  member,
                                                                  onSubmit,
                                                                  onClose,
                                                                  isLoading = false,
                                                              }) => {
    const [formData, setFormData] = useState<FormData>({
        email: '',
        role: member?.role || 'member',
        status: member?.status || 'Active',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await onSubmit(formData);
            onClose();
        } catch (error) {
            console.error('Failed to submit:', error);
        }
    };

    const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newRole = e.target.value as TeamMemberRole;
        setFormData(prev => ({
            ...prev,
            role: newRole
        }));
    };

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value as TeamMemberStatus;
        setFormData(prev => ({
            ...prev,
            status: newStatus
        }));
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md">
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-semibold">
                        {member ? 'Edit Team Member' : 'Add Team Member'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {!member && (
                        <Input
                            label="Email"
                            name="email"
                            type="email"
                            placeholder="Enter team member's email"
                            required
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    )}

                    <Select
                        label="Role"
                        name="role"
                        value={formData.role}
                        onChange={handleRoleChange}
                        options={roles}
                        required
                    />

                    {member && (
                        <Select
                            label="Status"
                            name="status"
                            value={formData.status}
                            onChange={handleStatusChange}
                            options={statuses}
                            required
                        />
                    )}

                    <div className="flex justify-end space-x-3 pt-4">
                        <Button
                            variant="secondary"
                            onClick={onClose}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            isLoading={isLoading}
                        >
                            {member ? 'Save Changes' : 'Add Member'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
