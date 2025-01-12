// components/team/TeamMemberForm.tsx
import React from 'react';
import { X } from 'lucide-react';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import {TeamMember} from "@/types/team";

interface TeamMemberFormProps {
    member?: TeamMember;
    onSubmit: (data: Partial<TeamMember>) => void;
    onClose: () => void;
    isLoading?: boolean;
}

const departments = [
    { value: 'Engineering', label: 'Engineering' },
    { value: 'Design', label: 'Design' },
    { value: 'Management', label: 'Management' },
    { value: 'Marketing', label: 'Marketing' },
    { value: 'Sales', label: 'Sales' },
];

const statusOptions = [
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
    const [formData, setFormData] = React.useState({
        name: member?.name || '',
        email: member?.email || '',
        role: member?.role || '',
        department: member?.department || departments[0].value,
        status: member?.status || 'Active',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
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
                    <Input
                        label="Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />

                    <Input
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />

                    <Input
                        label="Role"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        required
                    />

                    <Select
                        label="Department"
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        options={departments}
                    />

                    <Select
                        label="Status"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        options={statusOptions}
                    />

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
}