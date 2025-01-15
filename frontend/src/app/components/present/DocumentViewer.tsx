// components/present/DocumentViewer.tsx
import React from 'react';
import Image from 'next/image';
import { X, Download, Share2, ExternalLink, File, FileText, Layout, Code } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Card } from '@/components/ui/card';
import { ViewableItem, Document } from '@/types/present';

interface DocumentViewerProps {
    item: ViewableItem | null;
    onClose: () => void;
    onShare: () => void;
    onDownload: (item: ViewableItem) => void;
    onEdit?: (item: ViewableItem) => void;
}

const getDocumentIcon = (type: string) => {
    switch (type) {
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

// Type guard to check if item is a Document
const isDocument = (item: ViewableItem): item is Document => {
    return 'lastModified' in item;
};

export default function DocumentViewer({ item, onClose, onShare, onDownload }: DocumentViewerProps) {
    if (!item) return null;

    const Icon = getDocumentIcon(item.type);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-3">
                        <Icon className="h-6 w-6 text-blue-600" />
                        <div>
                            <h2 className="text-xl font-semibold">{item.title}</h2>
                            <p className="text-sm text-gray-500">{item.type}</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onShare}
                            leftIcon={<Share2 className="h-4 w-4" />}
                        >
                            Share
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDownload(item)}
                            leftIcon={<Download className="h-4 w-4" />}
                        >
                            Download
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(item.preview, '_blank')}
                            leftIcon={<ExternalLink className="h-4 w-4" />}
                        >
                            Open
                        </Button>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                        >
                            <X className="h-5 w-5 text-gray-500" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    <Card className="mb-4">
                        <div className="relative aspect-[16/9] rounded-t-lg overflow-hidden bg-gray-100 dark:bg-gray-900">
                            <Image
                                src={item.preview}
                                alt={item.title}
                                fill
                                className="object-contain"
                            />
                        </div>
                        <div className="p-4">
                            {isDocument(item) && (
                                <div className="text-sm text-gray-500">
                                    Last modified: {new Date(item.lastModified).toLocaleDateString()}
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* Additional Sections */}
                    <div className="grid grid-cols-2 gap-4">
                        <Card className="p-4">
                            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                                Details
                            </h3>
                            <div className="space-y-2 text-sm text-gray-500">
                                <div className="flex justify-between">
                                    <span>Type</span>
                                    <span>{item.type}</span>
                                </div>
                                {isDocument(item) ? (
                                    <div className="flex justify-between">
                                        <span>Modified</span>
                                        <span>{new Date(item.lastModified).toLocaleDateString()}</span>
                                    </div>
                                ) : (
                                    <div className="flex justify-between">
                                        <span>Tool</span>
                                        <span>{item.tool}</span>
                                    </div>
                                )}
                            </div>
                        </Card>

                        <Card className="p-4">
                            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                                Quick Actions
                            </h3>
                            <div className="space-y-2">
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={onShare}
                                    className="w-full"
                                >
                                    Share {isDocument(item) ? 'Document' : 'Mockup'}
                                </Button>
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => onDownload(item)}
                                    className="w-full"
                                >
                                    Download {isDocument(item) ? 'Document' : 'Mockup'}
                                </Button>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
