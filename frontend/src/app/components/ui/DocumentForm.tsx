import React from 'react';
import { X } from 'lucide-react';
import Button from './Button';
import Input from './Input';
import Select from './Select';
import TextArea from './TextArea';

interface Document {
    id: number;
    title: string;
    type: string;
    project: string;
    content: string;
    lastModified: string;
    author: string;
    status: string;
}

interface DocumentFormData {
    title: string;
    type: string;
    project: string;
    content: string;
    status?: string;
}

interface DocumentFormProps {
    initialData?: Document;
    onSubmit: (data: DocumentFormData) => void;
    onClose: () => void;
    isLoading?: boolean;
}

const documentTypes = [
    { value: 'High-Level Design', label: 'High-Level Design' },
    { value: 'Low-Level Design', label: 'Low-Level Design' },
    { value: 'Architecture', label: 'Architecture' },
    { value: 'Technical Spec', label: 'Technical Spec' },
    { value: 'Requirements', label: 'Requirements' }
];

const projects = [
    { value: 'E-commerce Platform', label: 'E-commerce Platform' },
    { value: 'Mobile App Redesign', label: 'Mobile App Redesign' },
    { value: 'API Integration', label: 'API Integration' }
];

const statuses = [
    { value: 'Draft', label: 'Draft' },
    { value: 'In Review', label: 'In Review' },
    { value: 'Approved', label: 'Approved' },
    { value: 'Rejected', label: 'Rejected' }
];

const DocumentForm: React.FC<DocumentFormProps> = ({
                                                       initialData,
                                                       onSubmit,
                                                       onClose,
                                                       isLoading = false
                                                   }) => {
    const [formData, setFormData] = React.useState<DocumentFormData>({
        title: initialData?.title || '',
        type: initialData?.type || documentTypes[0].value,
        project: initialData?.project || projects[0].value,
        content: initialData?.content || '',
        status: initialData?.status || 'Draft'
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const isEditing = !!initialData;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl">
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-semibold">
                        {isEditing ? 'Edit Document' : 'Create New Document'}
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
                            options={projects}
                            required
                        />
                    </div>

                    {isEditing && (
                        <Select
                            label="Status"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            options={statuses}
                            required
                        />
                    )}

                    <TextArea
                        label="Document Content"
                        name="content"
                        value={formData.content}
                        onChange={handleChange}
                        placeholder="Enter document content..."
                        rows={8}
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
                            {isEditing ? 'Save Changes' : 'Create Document'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DocumentForm;