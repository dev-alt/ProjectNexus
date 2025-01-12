import React, { useState } from 'react';
import { X } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';

import { Mockup } from '@/types/types';

interface MockupFormProps {
    mockup?: Mockup; // If provided, we're editing; if not, we're creating
    onClose: () => void;
    onSubmit: (data: Partial<Mockup>) => void;
}

// Form options
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

const projects = [
    { value: 'E-commerce Platform', label: 'E-commerce Platform' },
    { value: 'Mobile App Redesign', label: 'Mobile App Redesign' },
    { value: 'API Integration', label: 'API Integration' },
];

const statuses = [
    { value: 'Draft', label: 'Draft' },
    { value: 'In Review', label: 'In Review' },
    { value: 'Approved', label: 'Approved' },
];

const MockupForm: React.FC<MockupFormProps> = ({ mockup, onClose, onSubmit }) => {
    const [formData, setFormData] = useState<Partial<Mockup>>({
        name: '',
        project: '',
        type: 'Wireframe',
        tool: 'Figma',
        status: 'Draft',
        thumbnail: '/api/placeholder/300/200', // Default placeholder
        ...mockup, // Spread existing mockup data if editing
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name?.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!formData.project?.trim()) {
            newErrors.project = 'Project is required';
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
            // Add timestamps
            const submitData = {
                ...formData,
                lastModified: new Date().toISOString(),
                author: 'Current User', // In a real app, this would come from auth context
            };

            await onSubmit(submitData);
            onClose();
        } catch (error) {
            console.error('Error submitting form:', error);
            // Handle error (show error message, etc.)
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Clear error when field is edited
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl">
                {/* Header */}
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

                {/* Form */}
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
                            name="project"
                            value={formData.project}
                            onChange={handleChange}
                            options={projects}
                            error={errors.project}
                            required
                        />

                        <Select
                            label="Type"
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            options={mockupTypes}
                            error={errors.type}
                            required
                        />
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
                        />

                        {mockup && ( // Only show status select when editing
                            <Select
                                label="Status"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                options={statuses}
                                error={errors.status}
                                required
                            />
                        )}
                    </div>

                    {/* Actions */}
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