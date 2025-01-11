'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Search, Filter, Plus, MoreVertical } from 'lucide-react';

// Mock data - replace with actual data fetching
const documents = [
    {
        id: 1,
        title: 'E-commerce Platform HLD',
        type: 'High-Level Design',
        project: 'E-commerce Platform',
        lastModified: '2024-01-10T10:30:00',
        author: 'Alex Morrison',
        status: 'In Review'
    },
    {
        id: 2,
        title: 'Mobile App Architecture',
        type: 'Architecture',
        project: 'Mobile App Redesign',
        lastModified: '2024-01-09T15:45:00',
        author: 'Sarah Chen',
        status: 'Draft'
    },
    {
        id: 3,
        title: 'API Integration Specs',
        type: 'Technical Spec',
        project: 'API Integration',
        lastModified: '2024-01-08T09:15:00',
        author: 'Michael Scott',
        status: 'Approved'
    }
];

const documentTypes = [
    'All Documents',
    'High-Level Design',
    'Low-Level Design',
    'Architecture',
    'Technical Spec',
    'Requirements'
];

export default function DocumentsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedType, setSelectedType] = useState('All Documents');

    const filteredDocuments = documents.filter(doc => {
        const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doc.project.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = selectedType === 'All Documents' || doc.type === selectedType;
        return matchesSearch && matchesType;
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold">Documents</h1>
                <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    New Document
                </button>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-grow">
                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search documents..."
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
                        {documentTypes.map((type) => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                    <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                        <Filter className="h-5 w-5 text-gray-500" />
                    </button>
                </div>
            </div>

            {/* Document Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredDocuments.map((doc) => (
                    <Card key={doc.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <FileText className="h-5 w-5 text-blue-600" />
                                <CardTitle className="text-base font-medium">{doc.title}</CardTitle>
                            </div>
                            <button className="text-gray-500 hover:text-gray-700">
                                <MoreVertical className="h-5 w-5" />
                            </button>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Project</span>
                                    <span className="font-medium">{doc.project}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Type</span>
                                    <span>{doc.type}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Last Modified</span>
                                    <span>{new Date(doc.lastModified).toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Author</span>
                                    <span>{doc.author}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm pt-2">
                                    <span className="text-gray-500">Status</span>
                                    <span className={`px-2 py-1 rounded-full text-xs
                                        ${doc.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                        doc.status === 'In Review' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-gray-100 text-gray-800'}`}>
                                        {doc.status}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}