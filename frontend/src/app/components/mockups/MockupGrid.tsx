// components/mockups/MockupGrid.tsx
import React from 'react';
import Image from 'next/image';
import { ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Button from '@/components/ui/Button';
import { Mockup } from "@/types/mockup";
import { StatusBadge } from './StatusBadge';
import { MockupActions } from './MockupActions';

interface MockupGridProps {
    mockups: Mockup[];
    onEdit: (mockup: Mockup) => void;
    onDelete: (mockup: Mockup) => void;
    onOpen: (mockup: Mockup) => void;
}

export const MockupGrid: React.FC<MockupGridProps> = ({ mockups, onEdit, onDelete, onOpen }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockups.map((mockup) => (
            <Card key={mockup.id} className="hover:shadow-lg transition-shadow">
                <div className="relative">
                    <Image
                        src={mockup.thumbnail || '/api/placeholder/300/200'}
                        alt={mockup.name}
                        width={300}
                        height={200}
                        className="w-full h-40 object-cover rounded-t-lg"
                    />
                    <div className="absolute top-2 right-2">
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => onOpen(mockup)}
                            leftIcon={<ExternalLink className="h-4 w-4" />}
                        >
                            Open
                        </Button>
                    </div>
                </div>
                <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="text-lg">{mockup.name}</CardTitle>
                            <p className="text-sm text-gray-500">Project ID: {mockup.projectId}</p>
                        </div>
                        <MockupActions
                            mockup={mockup}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            onOpen={onOpen}
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center text-sm">
                            <span>{mockup.type}</span>
                            <StatusBadge status={mockup.status} />
                        </div>
                        <div className="flex justify-between items-center text-sm text-gray-500">
                            <span>Created by: {mockup.createdBy}</span>
                            <span>{new Date(mockup.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">{mockup.tool}</span>
                            <span className="text-sm text-gray-500">
                                Updated: {new Date(mockup.updatedAt).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        ))}
    </div>
);
