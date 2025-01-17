// app/present/page.tsx
"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { useProjects } from '@/lib/hooks/use-projects';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ProjectSelectionPage() {
    const router = useRouter();
    const { projects, isLoading } = useProjects();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8">
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">Select a Project</h1>
                    <p className="text-gray-600 mt-2">Choose a project to view its presentation</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                        <Card
                            key={project.id}
                            className="hover:shadow-lg transition-shadow cursor-pointer"
                            onClick={() => router.push(`/present/${project.id}`)}
                        >
                            <CardHeader>
                                <div className="w-full h-48 bg-gray-100 rounded-t-lg overflow-hidden">
                                    <img
                                        src={project.thumbnail || '/api/placeholder/400/200'}
                                        alt={project.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <CardTitle className="mt-4">{project.name}</CardTitle>
                                <CardDescription>{project.status}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <p className="text-sm text-gray-600 line-clamp-2">
                                        {project.description}
                                    </p>
                                    <div className="flex justify-between items-center text-sm text-gray-500">
                                        <span>Progress: {project.progress}%</span>
                                        <span>{new Date(project.startDate).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {projects.length === 0 && (
                    <div className="text-center py-12">
                        <h2 className="text-xl font-semibold text-gray-900">No projects found</h2>
                        <p className="mt-2 text-gray-600">
                            There are no projects available for presentation at this time.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
