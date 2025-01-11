'use client';

import { useState } from 'react';
import Image from 'next/image'; // Import next/image
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    FileText,
    Image as ImageIcon, // Rename to avoid conflict with next/image
    ChevronRight,
    ExternalLink,
    Download,
    Share2,
    BookOpen,
    Layout,
} from 'lucide-react';

// Mock data - replace with actual data fetching
const projectData = {
    id: 1,
    name: 'E-commerce Platform Redesign',
    description:
        'A complete overhaul of the existing e-commerce platform with focus on improved user experience, faster checkout process, and modern design principles.',
    status: 'In Progress',
    progress: 65,
    startDate: '2024-01-01',
    endDate: '2024-06-30',
    thumbnail: '/api/placeholder/800/400',
    team: [
        { id: 1, name: 'Sarah Chen', role: 'Lead Designer', avatar: '/api/placeholder/32/32' },
        { id: 2, name: 'Alex Morrison', role: 'Tech Lead', avatar: '/api/placeholder/32/32' },
        { id: 3, name: 'Michael Scott', role: 'Project Manager', avatar: '/api/placeholder/32/32' },
    ],
    documents: [
        {
            id: 1,
            type: 'High-Level Design',
            title: 'System Architecture Overview',
            lastModified: '2024-01-10',
            preview: '/api/placeholder/400/200',
        },
        {
            id: 2,
            type: 'Technical Spec',
            title: 'API Integration Documentation',
            lastModified: '2024-01-15',
            preview: '/api/placeholder/400/200',
        },
    ],
    mockups: [
        {
            id: 1,
            title: 'User Dashboard',
            type: 'Wireframe',
            preview: '/api/placeholder/400/200',
            tool: 'Figma',
        },
        {
            id: 2,
            title: 'Mobile App Flow',
            type: 'Prototype',
            preview: '/api/placeholder/400/200',
            tool: 'Sketch',
        },
    ],
};

export default function ProjectPresentation() {
    const [activeSection, setActiveSection] = useState('overview');

    return (
        <div className="space-y-8 pb-8">
            {/* Project Header */}
            <div className="relative h-64 bg-gray-900 rounded-lg overflow-hidden">
                {/* Use next/image for optimized image */}
                <Image
                    src={projectData.thumbnail}
                    alt={projectData.name}
                    fill
                    className="object-cover opacity-50"
                    style={{ objectFit: 'cover' }}
                />
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-gray-900 to-transparent">
                    <div className="flex justify-between items-end">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2">{projectData.name}</h1>
                            <div className="flex items-center space-x-4">
                <span className="px-3 py-1 bg-blue-500 text-white rounded-full text-sm">
                  {projectData.status}
                </span>
                                <span className="text-gray-300 text-sm">
                  {new Date(projectData.startDate).toLocaleDateString()} -
                                    {new Date(projectData.endDate).toLocaleDateString()}
                </span>
                            </div>
                        </div>
                        <div className="flex space-x-2">
                            <button className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white">
                                <Share2 className="h-5 w-5" />
                            </button>
                            <button className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white">
                                <Download className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex space-x-4 border-b">
                {['overview', 'documents', 'mockups', 'team'].map((section) => (
                    <button
                        key={section}
                        onClick={() => setActiveSection(section)}
                        className={`px-4 py-2 font-medium text-sm hover:text-blue-600 border-b-2 -mb-px ${
                            activeSection === section
                                ? 'border-blue-600 text-blue-600'
                                : 'border-transparent text-gray-500'
                        }`}
                    >
                        {section.charAt(0).toUpperCase() + section.slice(1)}
                    </button>
                ))}
            </div>

            {/* Content Sections */}
            <div className="space-y-6">
                {activeSection === 'overview' && (
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Project Overview</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">{projectData.description}</p>
                                <div className="mt-6">
                                    <h3 className="font-medium mb-2">Progress</h3>
                                    <div className="w-full h-2 bg-gray-200 rounded-full">
                                        <div
                                            className="h-2 bg-blue-600 rounded-full"
                                            style={{ width: `${projectData.progress}%` }}
                                        />
                                    </div>
                                    <p className="mt-1 text-sm text-gray-500">{projectData.progress}% Complete</p>
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
                                        {projectData.documents.slice(0, 2).map((doc) => (
                                            <div
                                                key={doc.id}
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
                                        {projectData.mockups.slice(0, 2).map((mockup) => (
                                            <div
                                                key={mockup.id}
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
                )}

                {activeSection === 'documents' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projectData.documents.map((doc) => (
                            <Card key={doc.id} className="hover:shadow-lg transition-shadow">
                                <div className="relative">
                                    {/* Use next/image for optimized image */}
                                    <Image
                                        src={doc.preview}
                                        alt={doc.title}
                                        width={400}
                                        height={200}
                                        className="w-full h-40 object-cover rounded-t-lg"
                                    />
                                    <button className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-lg hover:bg-gray-100">
                                        <ExternalLink className="h-4 w-4 text-gray-600" />
                                    </button>
                                </div>
                                <CardContent className="p-4">
                                    <h3 className="font-medium mb-1">{doc.title}</h3>
                                    <p className="text-sm text-gray-500">{doc.type}</p>
                                    <p className="text-sm text-gray-500 mt-2">
                                        Last modified: {new Date(doc.lastModified).toLocaleDateString()}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {activeSection === 'mockups' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projectData.mockups.map((mockup) => (
                            <Card key={mockup.id} className="hover:shadow-lg transition-shadow">
                                <div className="relative">
                                    {/* Use next/image for optimized image */}
                                    <Image
                                        src={mockup.preview}
                                        alt={mockup.title}
                                        width={400}
                                        height={200}
                                        className="w-full h-40 object-cover rounded-t-lg"
                                    />
                                    <button className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-lg hover:bg-gray-100">
                                        <ExternalLink className="h-4 w-4 text-gray-600" />
                                    </button>
                                </div>
                                <CardContent className="p-4">
                                    <h3 className="font-medium mb-1">{mockup.title}</h3>
                                    <div className="flex justify-between items-center">
                                        <p className="text-sm text-gray-500">{mockup.type}</p>
                                        <p className="text-sm text-gray-500">{mockup.tool}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {activeSection === 'team' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projectData.team.map((member) => (
                            <Card key={member.id} className="hover:shadow-lg transition-shadow">
                                <CardContent className="p-4">
                                    <div className="flex items-center space-x-4">
                                        {/* Use next/image for optimized image */}
                                        <Image
                                            src={member.avatar}
                                            alt={`${member.name}'s avatar`}
                                            width={48}
                                            height={48}
                                            className="h-12 w-12 rounded-full"
                                        />
                                        <div>
                                            <h3 className="font-medium">{member.name}</h3>
                                            <p className="text-sm text-gray-500">{member.role}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}