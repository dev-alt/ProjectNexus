import React from 'react';
import Image from 'next/image';
import { X, Edit2, Clock, User, Download, Share2, ExternalLink } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/card';
import StatusBadge from '@/components/ui/StatusBadge';
import {Mockup} from "@/types/mockup";

interface MockupViewerProps {
    mockup: Mockup;
    onClose: () => void;
    onEdit: (mockup: Mockup) => void;
}

const MockupViewer: React.FC<MockupViewerProps> = ({
                                                       mockup,
                                                       onClose,
                                                       onEdit,
                                                   }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-5xl max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <div>
                        <h2 className="text-2xl font-semibold">{mockup.name}</h2>
                        <div className="flex items-center space-x-4 mt-2">
                            <span className="text-gray-500 text-sm">{mockup.type}</span>
                            <span className="text-gray-300">•</span>
                            <span className="text-gray-500 text-sm">{mockup.project}</span>
                            <span className="text-gray-300">•</span>
                            <StatusBadge status={mockup.status} />
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(mockup.thumbnail, '_blank')}
                            leftIcon={<ExternalLink className="h-4 w-4" />}
                        >
                            Open in {mockup.tool}
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            leftIcon={<Share2 className="h-4 w-4" />}
                        >
                            Share
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            leftIcon={<Download className="h-4 w-4" />}
                        >
                            Download
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEdit(mockup)}
                            leftIcon={<Edit2 className="h-4 w-4" />}
                        >
                            Edit
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
                    <div className="grid grid-cols-3 gap-6">
                        {/* Main Image */}
                        <div className="col-span-2">
                            <div className="relative aspect-[16/9] rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-900">
                                <Image
                                    src={mockup.thumbnail}
                                    alt={mockup.name}
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        </div>

                        {/* Metadata */}
                        <div className="space-y-6">
                            <Card>
                                <CardContent className="p-4">
                                    <h3 className="font-semibold mb-4">Mockup Details</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center text-sm">
                                            <User className="h-4 w-4 text-gray-400 mr-2" />
                                            <span className="text-gray-600 dark:text-gray-300">
                        Created by {mockup.author}
                      </span>
                                        </div>
                                        <div className="flex items-center text-sm">
                                            <Clock className="h-4 w-4 text-gray-400 mr-2" />
                                            <span className="text-gray-600 dark:text-gray-300">
                        Last modified {new Date(mockup.lastModified).toLocaleDateString()}
                      </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-4">
                                    <h3 className="font-semibold mb-4">Version History</h3>
                                    <div className="space-y-3">
                                        {/* Example version history - would come from API */}
                                        <div className="text-sm">
                                            <div className="font-medium">Version 3 (Current)</div>
                                            <div className="text-gray-500">Updated layout and colors</div>
                                            <div className="text-gray-400 text-xs">2 hours ago</div>
                                        </div>
                                        <div className="text-sm">
                                            <div className="font-medium">Version 2</div>
                                            <div className="text-gray-500">Added new components</div>
                                            <div className="text-gray-400 text-xs">Yesterday</div>
                                        </div>
                                        <div className="text-sm">
                                            <div className="font-medium">Version 1</div>
                                            <div className="text-gray-500">Initial design</div>
                                            <div className="text-gray-400 text-xs">2 days ago</div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MockupViewer;
