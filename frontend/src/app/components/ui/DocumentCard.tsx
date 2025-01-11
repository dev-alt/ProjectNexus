import React from 'react';
import { FileText, MoreVertical } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import StatusBadge from './StatusBadge';
import { Document } from '@/types/types';

interface DocumentCardProps {
    document: Document;
    onEdit?: (doc: Document) => void;
    onDelete?: (doc: Document) => Promise<void>;
    onView?: (doc: Document) => void;
}

const DocumentCard: React.FC<DocumentCardProps> = ({
                                                       document,
                                                       onEdit,
                                                       onDelete,
                                                       onView,
                                                   }) => {
    const [showActions, setShowActions] = React.useState(false);

    const handleMoreClick = () => {
        setShowActions(!showActions);
    };

    return (
        <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <CardTitle className="text-base font-medium">{document.title}</CardTitle>
                </div>
                <div className="relative">
                    <button
                        onClick={handleMoreClick}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <MoreVertical className="h-5 w-5" />
                    </button>
                    {showActions && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                            {onView && (
                                <button
                                    onClick={() => onView(document)}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    View Document
                                </button>
                            )}
                            {onEdit && (
                                <button
                                    onClick={() => onEdit(document)}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    Edit Document
                                </button>
                            )}
                            {onDelete && (
                                <button
                                    onClick={() => onDelete(document)}
                                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                >
                                    Delete Document
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Project</span>
                        <span className="font-medium">{document.project}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Type</span>
                        <span>{document.type}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Last Modified</span>
                        <span>{new Date(document.lastModified).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Author</span>
                        <span>{document.author}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm pt-2">
                        <span className="text-gray-500">Status</span>
                        <StatusBadge status={document.status} />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default DocumentCard;