import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import TextArea from '@/components/ui/TextArea';
import Select from '@/components/ui/Select';
import { Document, DocumentType, DocumentStatus } from '@/types/documents';
import { useProjects } from "@/lib/hooks/use-projects";

interface DocumentFormProps {
    initialData?: Document;
    onSubmit: (data: {
        title: string;
        type: DocumentType;
        project: string;
        content: string;
        status: DocumentStatus;
    }) => void;
    onClose: () => void;
    isLoading?: boolean;
}

interface SelectOption {
    value: string;
    label: string;
}

const documentTypes: SelectOption[] = [
    { value: 'High-Level Design', label: 'High-Level Design' },
    { value: 'Low-Level Design', label: 'Low-Level Design' },
    { value: 'Architecture', label: 'Architecture' },
    { value: 'Technical Spec', label: 'Technical Spec' },
    { value: 'Requirements', label: 'Requirements' }
];

// Add status options
const documentStatuses: SelectOption[] = [
    { value: 'Draft', label: 'Draft' },
    { value: 'In Review', label: 'In Review' },
    { value: 'Approved', label: 'Approved' },
    { value: 'Rejected', label: 'Rejected' },
];

const DocumentForm: React.FC<DocumentFormProps> = ({
                                                       initialData,
                                                       onSubmit,
                                                       onClose,
                                                       isLoading = false
                                                   }) => {
    const { projects } = useProjects();
    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        type: initialData?.type || documentTypes[0].value,
        project: initialData?.projectId || '',
        content: initialData?.content || '',
        status: initialData?.status || documentStatuses[0].value, // Add status to formData
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    // Transform projects for select input
    const projectOptions: SelectOption[] = projects.map(project => ({
        value: project.id.toString(),
        label: `${project.name}${project.status ? ` (${project.status})` : ''}`
    }));

    // Set default project if available and none selected
    useEffect(() => {
        if (!formData.project && projectOptions.length > 0) {
            setFormData(prev => ({
                ...prev,
                project: projectOptions[0].value
            }));
        }
    }, [projectOptions, formData.project]);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        }

        if (!formData.content.trim()) {
            newErrors.content = 'Content is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        onSubmit({
            title: formData.title,
            type: formData.type as DocumentType,
            project: formData.project,
            content: formData.content,
            status: formData.status as DocumentStatus, // Pass status in onSubmit
        });
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when field is edited
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl">
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-semibold">
                        {initialData ? 'Edit Document' : 'Create New Document'}
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
                        label="Document Title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        error={errors.title}
                        placeholder="Enter document title"
                        required
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Select
                            label="Document Type"
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            options={documentTypes}
                            required
                        />

                        <Select
                            label="Project"
                            name="project"
                            value={formData.project}
                            onChange={handleChange}
                            options={projectOptions}
                            required
                        />
                    </div>

                    <TextArea
                        label="Document Content"
                        name="content"
                        value={formData.content}
                        onChange={handleChange}
                        error={errors.content}
                        placeholder="Enter document content..."
                        rows={8}
                        required
                    />
                    {/* Add Status Select */}
                    <Select
                        label="Status"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        options={documentStatuses}
                        required
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
                            {initialData ? 'Save Changes' : 'Create Document'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DocumentForm;
