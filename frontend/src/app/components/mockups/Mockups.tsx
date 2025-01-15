import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Search, Plus, LayoutGrid, Rows, ExternalLink, MoreVertical, Trash2, Edit2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import {Mockup} from "@/types/mockup";

interface MockupHeaderProps {
    onCreateNew: () => void;
}

interface MockupControlsProps {
    searchQuery: string;
    selectedType: string;
    viewMode: 'grid' | 'list';
    onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onTypeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    onViewModeChange: (mode: 'grid' | 'list') => void;
    mockupTypes: string[];
}

interface MockupGridProps {
    mockups: Mockup[];
    onEdit: (mockup: Mockup) => void;
    onDelete: (mockup: Mockup) => void;
    onOpen: (mockup: Mockup) => void;
}

interface StatusBadgeProps {
    status: string;
}

interface MockupActionsProps {
    mockup: Mockup;
    onEdit: (mockup: Mockup) => void;
    onDelete: (mockup: Mockup) => void;
    onOpen: (mockup: Mockup) => void;
}

// Status Badge Component
const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
    const getStatusStyles = () => {
        switch (status.toLowerCase()) {
            case 'approved':
                return 'bg-green-100 text-green-800';
            case 'in review':
                return 'bg-yellow-100 text-yellow-800';
            case 'draft':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusStyles()}`}>
            {status}
        </span>
    );
};

// Mockup Actions Menu
const MockupActions: React.FC<MockupActionsProps> = ({ mockup, onEdit, onDelete, onOpen }) => {
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1 hover:bg-gray-100 rounded-full"
            >
                <MoreVertical className="h-5 w-5 text-gray-500" />
            </button>

            {showMenu && (
                <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                    <button
                        onClick={() => {
                            onOpen(mockup);
                            setShowMenu(false);
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Open
                    </button>
                    <button
                        onClick={() => {
                            onEdit(mockup);
                            setShowMenu(false);
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                        <Edit2 className="h-4 w-4 mr-2" />
                        Edit
                    </button>
                    <button
                        onClick={() => {
                            onDelete(mockup);
                            setShowMenu(false);
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                    </button>
                </div>
            )}
        </div>
    );
};

// Header Component
export const MockupHeader: React.FC<MockupHeaderProps> = ({ onCreateNew }) => (
    <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Mockups & Wireframes</h1>
        <Button
            onClick={onCreateNew}
            leftIcon={<Plus className="h-4 w-4" />}
        >
            New Mockup
        </Button>
    </div>
);

// Controls Component
export const MockupControls: React.FC<MockupControlsProps> = ({
                                                                  searchQuery,
                                                                  selectedType,
                                                                  viewMode,
                                                                  onSearchChange,
                                                                  onTypeChange,
                                                                  onViewModeChange,
                                                                  mockupTypes,
                                                              }) => (
    <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-grow">
            <Input
                placeholder="Search mockups..."
                value={searchQuery}
                onChange={onSearchChange}
                leftIcon={<Search className="h-5 w-5" />}
                fullWidth
            />
        </div>
        <div className="flex gap-2">
            <Select
                value={selectedType}
                onChange={onTypeChange}
                options={mockupTypes.map(type => ({ value: type, label: type }))}
            />
            <div className="flex border border-gray-300 rounded-lg">
                <button
                    className={`px-3 py-2 rounded-l-lg ${
                        viewMode === 'grid' ? 'bg-gray-100' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => onViewModeChange('grid')}
                >
                    <LayoutGrid className="h-5 w-5 text-gray-500" />
                </button>
                <button
                    className={`px-3 py-2 rounded-r-lg ${
                        viewMode === 'list' ? 'bg-gray-100' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => onViewModeChange('list')}
                >
                    <Rows className="h-5 w-5 text-gray-500" />
                </button>
            </div>
        </div>
    </div>
);

// Grid View Component
export const MockupGrid: React.FC<MockupGridProps> = ({ mockups, onEdit, onDelete, onOpen }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockups.map((mockup) => (
            <Card key={mockup.id} className="hover:shadow-lg transition-shadow">
                <div className="relative">
                    <Image
                        src={mockup.thumbnail}
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
                            <p className="text-sm text-gray-500">{mockup.project}</p>
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
                            <span>{mockup.author}</span>
                            <span>{new Date(mockup.lastModified).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">{mockup.tool}</span>
                            <span className="text-sm text-gray-500">
                                Last modified: {new Date(mockup.lastModified).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        ))}
    </div>
);

// List View Component
export const MockupList: React.FC<MockupGridProps> = ({ mockups, onEdit, onDelete, onOpen }) => (
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
                                src={mockup.thumbnail}
                                alt={mockup.name}
                                width={40}
                                height={40}
                                className="h-10 w-10 rounded object-cover"
                            />
                            <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{mockup.name}</div>
                                <div className="text-sm text-gray-500">{mockup.author}</div>
                            </div>
                        </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{mockup.project}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{mockup.type}</div>
                        <div className="text-sm text-gray-500">{mockup.tool}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={mockup.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(mockup.lastModified).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex justify-end space-x-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onOpen(mockup)}
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

// Assign the object to a variable
const MockupComponents = {
    MockupHeader,
    MockupControls,
    MockupGrid,
    MockupList,
    StatusBadge,
};

// Export the variable as the default
export default MockupComponents;
