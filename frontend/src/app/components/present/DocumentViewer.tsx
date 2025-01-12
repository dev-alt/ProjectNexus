// components/present/DocumentViewer.tsx
import React from 'react';
import Image from 'next/image';
import { X, Download, Share2, ExternalLink } from 'lucide-react';
import Button from '@/components/ui/Button';
import { ViewableItem } from '@/types/present';

interface DocumentViewerProps {
    item: ViewableItem | null;
    onClose: () => void;
    onShare: () => void;
    onDownload: (item: ViewableItem) => void;
}

export default function DocumentViewer({ item, onClose, onShare, onDownload }: DocumentViewerProps) {
    if (!item) return null;

    const isDocument = 'lastModified' in item;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                    <div>
                        <h2 className="text-xl font-semibold">{item.title}</h2>
                        <p className="text-sm text-gray-500">{item.type}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onShare()}
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
                <div className="flex-1 overflow-y-auto p-4">
                    <div className="relative aspect-[16/9] rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-900">
                        <Image
                            src={item.preview}
                            alt={item.title}
                            fill
                            className="object-contain"
                        />
                    </div>
                    {isDocument && (
                        <div className="mt-4 text-sm text-gray-500">
                            Last modified: {new Date(item.lastModified).toLocaleDateString()}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}