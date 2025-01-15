// app/components/documents/DocumentPreview.tsx
import React from 'react';
import { File, FileText, Layout, Code } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Document } from '@/types/documents';

interface DocumentPreviewProps {
    document: Document;
    className?: string;
    onClose: () => void;
    onEdit: () => void;
}

const DocumentPreview = ({ document, className = '', onClose, onEdit }: DocumentPreviewProps) => {
    // Helper to get icon based on document type
    const getDocumentIcon = () => {
        switch (document.type) {
            case 'High-Level Design':
                return Layout;
            case 'Low-Level Design':
                return Code;
            case 'Technical Spec':
                return FileText;
            default:
                return File;
        }
    };

    const Icon = getDocumentIcon();

    return (
        <Card className={`p-6 overflow-hidden ${className}`}>
            {/* Document Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                    <Icon className="h-6 w-6 text-blue-600" />
                    <h3 className="text-lg font-semibold">{document.title}</h3>
                </div>
                <span className="text-sm text-gray-500">
                    Version {document.version}
                </span>
            </div>

            {/* Content Preview */}
            <div className="prose prose-sm max-w-none dark:prose-invert">
                {/* Simple text preview */}
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 font-mono text-sm whitespace-pre-wrap">
                    {document.content.length > 500
                        ? `${document.content.substring(0, 500)}...`
                        : document.content
                    }
                </div>
            </div>

            {/* Document Metadata */}
            <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                <span>Created by {document.createdBy}</span>
                <span>Last modified: {new Date(document.updatedAt).toLocaleDateString()}</span>
            </div>

            {/* Action Buttons */}
            <div className="mt-4 flex justify-end space-x-2">
                <button onClick={onEdit} className="btn btn-primary">Edit</button>
                <button onClick={onClose} className="btn btn-secondary">Close</button>
            </div>
        </Card>
    );
};

export default DocumentPreview;
