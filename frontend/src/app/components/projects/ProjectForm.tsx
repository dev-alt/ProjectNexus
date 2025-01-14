// ProjectForm.tsx
import React, { useState } from 'react';
import { X } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import TextArea from '@/components/ui/TextArea';
import Select from '@/components/ui/Select';
import {Project} from "@/types/types";


interface ProjectFormProps {
    initialData?: Project;
    onSubmit: (data: Omit<Project, 'id' | 'lastUpdated' | 'documents'>) => void;
    onClose: () => void;
    isLoading?: boolean;
}

const statusOptions = [
    { value: 'Planning', label: 'Planning' },
    { value: 'In Progress', label: 'In Progress' },
    { value: 'Review', label: 'Review' },
    { value: 'Completed', label: 'Completed' },
];

export const ProjectForm: React.FC<ProjectFormProps> = ({
                                                            initialData,
                                                            onSubmit,
                                                            onClose,
                                                            isLoading = false,
                                                        }) => {
    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        description: initialData?.description || '',
        status: initialData?.status || 'Planning',
        team: initialData?.team || 1,
        progress: initialData?.progress || 0,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'team' || name === 'progress' ? Number(value) : value
        }));
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl">
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-semibold">
                        {initialData ? 'Edit Project' : 'Create New Project'}
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
                        label="Project Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter project name"
                        required
                    />

                    <TextArea
                        label="Description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Enter project description"
                        rows={3}
                        required
                    />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Select
                            label="Status"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            options={statusOptions}
                        />

                        <Input
                            type="number"
                            label="Team Size"
                            name="team"
                            value={formData.team.toString()}
                            onChange={handleChange}
                            min={1}
                            max={100}
                            required
                        />

                        <Input
                            type="number"
                            label="Progress (%)"
                            name="progress"
                            value={formData.progress.toString()}
                            onChange={handleChange}
                            min={0}
                            max={100}
                            required
                        />
                    </div>

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
                            disabled={isLoading}
                        >
                            {initialData ? 'Save Changes' : 'Create Project'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProjectForm;
