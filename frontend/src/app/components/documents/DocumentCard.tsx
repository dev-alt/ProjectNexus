// app/components/ui/DocumentCard.tsx
import React, { useState } from 'react';
import { FileText, MoreVertical } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import StatusBadge from '@/components/ui/StatusBadge';
import { Document } from '@/types/documents';

interface DocumentCardProps {
    document: Document;
    onEdit?: (doc: Document) => void;
    onDelete?: (doc: Document) => void;
    onView?: (doc: Document) => void;
}

const DocumentCard: React.FC<DocumentCardProps> = ({
                                                       document,
                                                       onEdit,
                                                       onDelete,
                                                       onView,
                                                   }) => {
    const [showActions, setShowActions] = useState(false);

    const handleMoreClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowActions(!showActions);
    };

    const handleAction = (
        e: React.MouseEvent,
        action: (doc: Document) => void
    ) => {
        e.stopPropagation();
        setShowActions(false);
        action(document);
    };
    console.log("DocumentCard - document:", document);
    return (
        <Card
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => onView?.(document)}
        >
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
                                    onClick={(e) => handleAction(e, onView)}
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
                        <span className="text-gray-500">Type</span>
                        <span>{document.type}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Project</span>
                        <span>{document.projectId}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Version</span>
                        <span>{document.version}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Created By</span>
                        <span>{document.createdBy}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Last Modified</span>
                        <span>{new Date(document.updatedAt).toLocaleDateString()}</span>
                    </div>
                    <div className="pt-2 flex justify-between items-center">
                        <span className="text-sm text-gray-500">Status</span>

                        <StatusBadge status={document.status || "Draft"} />




                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default DocumentCard;
