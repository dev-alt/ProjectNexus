import React, { useState } from 'react';
import { X } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { Mockup } from "@/types/mockup";
import { useProjectOptions } from '@/lib/hooks/use-project-options';

interface MockupFormProps {
    mockup?: Mockup;
    onClose: () => void;
    onSubmit: (data: Partial<Mockup>) => void;
}

const mockupTypes = [
    { value: 'Wireframe', label: 'Wireframe' },
    { value: 'Prototype', label: 'Prototype' },
    { value: 'High-fidelity', label: 'High-fidelity' },
];

const tools = [
    { value: 'Figma', label: 'Figma' },
    { value: 'Sketch', label: 'Sketch' },
    { value: 'Adobe XD', label: 'Adobe XD' },
];

const statuses = [
    { value: 'Draft', label: 'Draft' },
    { value: 'In Review', label: 'In Review' },
    { value: 'Approved', label: 'Approved' },
];

const MockupForm: React.FC<MockupFormProps> = ({ mockup, onClose, onSubmit }) => {
    const { projectOptions, isLoading: projectsLoading, error: projectsError } = useProjectOptions();

    const [formData, setFormData] = useState<Partial<Mockup>>({
        name: '',
        projectId: '',
        type: 'Wireframe',
        tool: 'Figma',
        status: 'Draft',
        thumbnail: '/api/placeholder/300/200',
        ...mockup,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name?.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!formData.projectId?.trim()) {
            newErrors.projectId = 'Project is required';
        }

        if (!formData.type?.trim()) {
            newErrors.type = 'Type is required';
        }

        if (!formData.tool?.trim()) {
            newErrors.tool = 'Tool is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        try {
            await onSubmit(formData);
            onClose();
        } catch (error) {
            console.error('Error submitting form:', error);
            setErrors(prev => ({
                ...prev,
                submit: error instanceof Error ? error.message : 'Failed to submit form'
            }));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    if (projectsError) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
                    <h2 className="text-red-600 mb-4">Error Loading Projects</h2>
                    <p>{projectsError.message}</p>
                    <Button onClick={onClose} className="mt-4">Close</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl">
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-semibold">
                        {mockup ? 'Edit Mockup' : 'Create New Mockup'}
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
                        label="Mockup Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        error={errors.name}
                        placeholder="Enter mockup name"
                        required
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Select
                            label="Project"
                            name="projectId"
                            value={formData.projectId}
                            onChange={handleChange}
                            options={projectOptions}
                            error={errors.projectId}
                            disabled={projectsLoading}
                            required
                        >
                            <option value="">Select a project</option>
                            {projectOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </Select>

                        <Select
                            label="Type"
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            options={mockupTypes}
                            error={errors.type}
                            required
                        >
                            {mockupTypes.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </Select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Select
                            label="Design Tool"
                            name="tool"
                            value={formData.tool}
                            onChange={handleChange}
                            options={tools}
                            error={errors.tool}
                            required
                        >
                            {tools.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </Select>

                        {mockup && (
                            <Select
                                label="Status"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                options={statuses}
                                error={errors.status}
                                required
                            >
                                {statuses.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </Select>
                        )}
                    </div>

                    {errors.submit && (
                        <div className="text-red-600 text-sm mt-2">
                            {errors.submit}
                        </div>
                    )}

                    <div className="flex justify-end space-x-3 pt-4">
                        <Button
                            variant="secondary"
                            onClick={onClose}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            isLoading={isSubmitting}
                        >
                            {mockup ? 'Save Changes' : 'Create Mockup'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MockupForm;
