'use client';

import { useState } from 'react';
import Image from 'next/image'; // Import next/image
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Plus, LayoutGrid, Rows, Link2, ExternalLink, MoreVertical } from 'lucide-react';

// Mockup data - ideally, this would come from an API
const mockups = [
    {
        id: 1,
        name: 'User Dashboard Wireframe',
        project: 'E-commerce Platform',
        type: 'Wireframe',
        lastModified: '2024-01-10T10:30:00',
        author: 'Sarah Chen',
        status: 'In Review',
        thumbnail: '/api/placeholder/300/200',
        tool: 'Figma',
    },
    {
        id: 2,
        name: 'Mobile App Flow',
        project: 'Mobile App Redesign',
        type: 'Prototype',
        lastModified: '2024-01-09T15:45:00',
        author: 'Alex Morrison',
        status: 'Approved',
        thumbnail: '/api/placeholder/300/200',
        tool: 'Sketch',
    },
    {
        id: 3,
        name: 'Settings Page Design',
        project: 'API Integration',
        type: 'High-fidelity',
        lastModified: '2024-01-08T09:15:00',
        author: 'Michael Scott',
        status: 'Draft',
        thumbnail: '/api/placeholder/300/200',
        tool: 'Adobe XD',
    },
];

// Mockup types for the filter dropdown
const mockupTypes = ['All Types', 'Wireframe', 'Prototype', 'High-fidelity'];

export default function MockupsPage() {
    // State for search query, selected type, and view mode
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedType, setSelectedType] = useState('All Types');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    // Filter mockups based on search query and selected type
    const filteredMockups = mockups.filter((mockup) => {
        const matchesSearch =
            mockup.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            mockup.project.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = selectedType === 'All Types' || mockup.type === selectedType;
        return matchesSearch && matchesType;
    });

    return (
        <div className="space-y-6">
            {/* Header section with title and "New Mockup" button */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold">Mockups & Wireframes</h1>
                <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    New Mockup
                </button>
            </div>

            {/* Controls section with search input, type filter, and view mode toggles */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-grow">
                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search mockups..."
                        className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    <select
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                    >
                        {mockupTypes.map((type) => (
                            <option key={type} value={type}>
                                {type}
                            </option>
                        ))}
                    </select>
                    <button
                        className={`px-3 py-2 border border-gray-300 rounded-lg ${
                            viewMode === 'grid' ? 'bg-gray-100' : 'bg-white'
                        }`}
                        onClick={() => setViewMode('grid')}
                    >
                        <LayoutGrid className="h-5 w-5 text-gray-500" />
                    </button>
                    <button
                        className={`px-3 py-2 border border-gray-300 rounded-lg ${
                            viewMode === 'list' ? 'bg-gray-100' : 'bg-white'
                        }`}
                        onClick={() => setViewMode('list')}
                    >
                        <Rows className="h-5 w-5 text-gray-500" />
                    </button>
                </div>
            </div>

            {/* Mockups display section - renders either grid or list view */}
            {viewMode === 'grid' ? (
                // Grid view
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredMockups.map((mockup) => (
                        <Card key={mockup.id} className="hover:shadow-lg transition-shadow">
                            <div className="relative">
                                {/* Use next/image for optimized image loading */}
                                <Image
                                    src={mockup.thumbnail}
                                    alt={mockup.name}
                                    width={300}
                                    height={200}
                                    className="w-full h-40 object-cover rounded-t-lg"
                                />
                                <div className="absolute top-2 right-2">
                                    <button className="p-1 bg-white rounded-full shadow-lg hover:bg-gray-100">
                                        <ExternalLink className="h-4 w-4 text-gray-600" />
                                    </button>
                                </div>
                            </div>
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-lg">{mockup.name}</CardTitle>
                                        <p className="text-sm text-gray-500">{mockup.project}</p>
                                    </div>
                                    <button className="text-gray-500 hover:text-gray-700">
                                        <MoreVertical className="h-5 w-5" />
                                    </button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-sm">
                                        <div className="flex items-center space-x-2">
                                            <Image // This is the icon. Replace with next/image if you have a local image, otherwise leave as is.
                                                src="/placeholder-icon.svg" // Replace with the actual path if you have a specific icon
                                                alt={`${mockup.type} icon`}
                                                width={16}
                                                height={16}
                                                className="h-4 w-4 text-gray-500"
                                            />
                                            <span>{mockup.type}</span>
                                        </div>
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-medium
                        ${
                                                mockup.status === 'Approved'
                                                    ? 'bg-green-100 text-green-800'
                                                    : mockup.status === 'In Review'
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : 'bg-gray-100 text-gray-800'
                                            }`}
                                        >
                      {mockup.status}
                    </span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm text-gray-500">
                                        <span>{mockup.author}</span>
                                        <span>{new Date(mockup.lastModified).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-500">{mockup.tool}</span>
                                        <button className="flex items-center text-sm text-blue-600 hover:text-blue-700">
                                            <Link2 className="h-4 w-4 mr-1" />
                                            Open
                                        </button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                // List view
                <div className="bg-white rounded-lg shadow">
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
                        {filteredMockups.map((mockup) => (
                            <tr key={mockup.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <div className="flex items-center">
                                        {/* Use next/image for optimized image loading */}
                                        <Image
                                            src={mockup.thumbnail}
                                            alt={mockup.name} // Add alt text for accessibility
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
                    <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${
                            mockup.status === 'Approved'
                                ? 'bg-green-100 text-green-800'
                                : mockup.status === 'In Review'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-gray-100 text-gray-800'
                        }`}
                    >
                      {mockup.status}
                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(mockup.lastModified).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button className="text-blue-600 hover:text-blue-900">Open</button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}