// components/mockups/MockupList.tsx
import React from 'react';
import Image from 'next/image';
import { ExternalLink } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Mockup } from "@/types/mockup";
import { StatusBadge } from './StatusBadge';
import { MockupActions } from './MockupActions';

interface MockupListProps {
    mockups: Mockup[];
    onEdit: (mockup: Mockup) => void;
    onDelete: (mockup: Mockup) => void;
    onOpen: (mockup: Mockup) => void;
}

export const MockupList: React.FC<MockupListProps> = ({ mockups, onEdit, onDelete, onOpen }) => (
    <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
            <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mockup
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Project
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Modified
                </th>
                <th className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                </th>
            </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
            {mockups.map((mockup) => (
                <tr key={mockup.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                        <div className="flex items-center">
                            <Image
                                src={mockup.thumbnail || '/api/placeholder/40/40'}
                                alt={mockup.name}
                                width={40}
                                height={40}
                                className="h-10 w-10 rounded object-cover"
                            />
                            <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{mockup.name}</div>
                                <div className="text-sm text-gray-500">Created by: {mockup.createdBy}</div>
                            </div>
                        </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{mockup.projectId}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{mockup.type}</div>
                        <div className="text-sm text-gray-500">{mockup.tool}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={mockup.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(mockup.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex justify-end space-x-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onOpen(mockup)}
                                leftIcon={<ExternalLink className="h-4 w-4" />}
                            >
                                Open
                            </Button>
                            <MockupActions
                                mockup={mockup}
                                onEdit={onEdit}
                                onDelete={onDelete}
                                onOpen={onOpen}
                            />
                        </div>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    </div>
);
