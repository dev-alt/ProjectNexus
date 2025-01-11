// app/projects/page.tsx
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Plus, Clock, Users, FileText, MoreVertical } from 'lucide-react';

const projects = [
    {
        id: 1,
        name: 'E-commerce Platform',
        description: 'Building a scalable e-commerce platform with modern architecture',
        status: 'In Progress',
        team: 8,
        documents: 12,
        lastUpdated: '2024-01-10T10:30:00',
        progress: 65
    },
    {
        id: 2,
        name: 'Mobile App Redesign',
        description: 'Redesigning the mobile app with new UI/UX guidelines',
        status: 'Planning',
        team: 5,
        documents: 6,
        lastUpdated: '2024-01-09T15:45:00',
        progress: 25
    },
    {
        id: 3,
        name: 'API Integration',
        description: 'Implementing third-party API integrations',
        status: 'Review',
        team: 4,
        documents: 8,
        lastUpdated: '2024-01-08T09:15:00',
        progress: 90
    }
];

export default function ProjectsPage() {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredProjects = projects.filter(project =>
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold">Projects</h1>
                <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    New Project
                </button>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search projects..."
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProjects.map((project) => (
                    <Card key={project.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader className="flex flex-row items-start justify-between pb-2">
                            <div className="space-y-1">
                                <CardTitle className="text-lg font-semibold">{project.name}</CardTitle>
                                <p className="text-sm text-gray-500">{project.description}</p>
                            </div>
                            <button className="text-gray-500 hover:text-gray-700">
                                <MoreVertical className="h-5 w-5" />
                            </button>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {/* Progress Bar */}
                                <div className="space-y-1">
                                    <div className="flex justify-between text-sm">
                                        <span>{project.progress}% Complete</span>
                                        <span className={`px-2 py-1 rounded-full text-xs
                                            ${project.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                                            project.status === 'Review' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-gray-100 text-gray-800'}`}>
                                            {project.status}
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-blue-600 h-2 rounded-full"
                                            style={{ width: `${project.progress}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-3 gap-4 pt-2">
                                    <div className="flex flex-col items-center p-2 bg-gray-50 rounded-lg">
                                        <Users className="h-4 w-4 text-gray-500 mb-1" />
                                        <span className="text-sm font-medium">{project.team}</span>
                                        <span className="text-xs text-gray-500">Team</span>
                                    </div>
                                    <div className="flex flex-col items-center p-2 bg-gray-50 rounded-lg">
                                        <FileText className="h-4 w-4 text-gray-500 mb-1" />
                                        <span className="text-sm font-medium">{project.documents}</span>
                                        <span className="text-xs text-gray-500">Docs</span>
                                    </div>
                                    <div className="flex flex-col items-center p-2 bg-gray-50 rounded-lg">
                                        <Clock className="h-4 w-4 text-gray-500 mb-1" />
                                        <span className="text-sm font-medium">
                                            {new Date(project.lastUpdated).toLocaleDateString()}
                                        </span>
                                        <span className="text-xs text-gray-500">Updated</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}