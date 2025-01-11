import React from 'react';
import { X, Edit2, Clock, User } from 'lucide-react';
import Button from './Button';
import StatusBadge from './StatusBadge';

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

interface DocumentViewerProps {
    document: Document;
    onClose: () => void;
    onEdit: (doc: Document) => void;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({
                                                           document,
                                                           onClose,
                                                           onEdit,
                                                       }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-4xl mt-8 mb-8">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <div>
                        <h2 className="text-2xl font-semibold">{document.title}</h2>
                        <div className="flex items-center space-x-4 mt-2">
                            <span className="text-gray-500 text-sm">{document.type}</span>
                            <span className="text-gray-300">•</span>
                            <span className="text-gray-500 text-sm">{document.project}</span>
                            <span className="text-gray-300">•</span>
                            <StatusBadge status={document.status} />
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Document Metadata */}
                <div className="flex items-center justify-between px-6 py-3 bg-gray-50 dark:bg-gray-700">
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                            <User className="h-4 w-4 mr-2" />
                            <span className="text-sm">{document.author}</span>
                        </div>
                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                            <Clock className="h-4 w-4 mr-2" />
                            <span className="text-sm">
                {new Date(document.lastModified).toLocaleString()}
              </span>
                        </div>
                    </div>
                    <Button
                        variant="secondary"
                        leftIcon={<Edit2 className="h-4 w-4" />}
                        onClick={() => onEdit(document)}
                    >
                        Edit Document
                    </Button>
                </div>

                {/* Document Content */}
                <div className="p-6">
                    <div className="prose dark:prose-invert max-w-none">
                        <div className="whitespace-pre-wrap">{document.content}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DocumentViewer;