// components/present/ProjectOverview.tsx
import React from 'react';
import { BookOpen, Layout, FileText, ImageIcon, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Document, Mockup } from '@/types/present';

interface ProjectOverviewProps {
    description: string;
    progress: number;
    documents: Document[];
    mockups: Mockup[];
    onDocumentClick?: (doc: Document) => void;
    onMockupClick?: (mockup: Mockup) => void;
}

export default function ProjectOverview({
                                            description,
                                            progress,
                                            documents,
                                            mockups,
                                            onDocumentClick,
                                            onMockupClick
                                        }: ProjectOverviewProps) {
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Project Overview</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-gray-600">{description}</p>
                    <div className="mt-6">
                        <h3 className="font-medium mb-2">Progress</h3>
                        <div className="w-full h-2 bg-gray-200 rounded-full">
                            <div
                                className="h-2 bg-blue-600 rounded-full"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <p className="mt-1 text-sm text-gray-500">{progress}% Complete</p>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <BookOpen className="h-5 w-5 mr-2" />
                            Recent Documents
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {documents.slice(0, 2).map((doc) => (
                                <div
                                    key={doc.id}
                                    onClick={() => onDocumentClick?.(doc)}
                                    className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
                                >
                                    <FileText className="h-5 w-5 text-gray-500 mr-3" />
                                    <div className="flex-grow">
                                        <p className="font-medium">{doc.title}</p>
                                        <p className="text-sm text-gray-500">{doc.type}</p>
                                    </div>
                                    <ChevronRight className="h-5 w-5 text-gray-400" />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Layout className="h-5 w-5 mr-2" />
                            Recent Mockups
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {mockups.slice(0, 2).map((mockup) => (
                                <div
                                    key={mockup.id}
                                    onClick={() => onMockupClick?.(mockup)}
                                    className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
                                >
                                    <ImageIcon className="h-5 w-5 text-gray-500 mr-3" />
                                    <div className="flex-grow">
                                        <p className="font-medium">{mockup.title}</p>
                                        <p className="text-sm text-gray-500">{mockup.type}</p>
                                    </div>
                                    <ChevronRight className="h-5 w-5 text-gray-400" />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}