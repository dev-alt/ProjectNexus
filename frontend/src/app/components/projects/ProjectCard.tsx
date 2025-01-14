// ProjectCard.tsx
import React, { useState } from 'react';
import { Clock, Users, FileText, MoreVertical } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {Project} from "@/types/types";


interface ProjectCardProps {
    project: Project;
    onEdit?: (project: Project) => void;
    onDelete?: (project: Project) => void;
    onView?: (project: Project) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
                                                            project,
                                                            onEdit,
                                                            onDelete,
                                                            onView,
                                                        }) => {
    const [showActions, setShowActions] = useState(false);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'In Progress':
                return 'bg-blue-100 text-blue-800';
            case 'Review':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-start justify-between pb-2">
                <div className="space-y-1">
                    <CardTitle className="text-lg font-semibold">{project.name}</CardTitle>
                    <p className="text-sm text-gray-500">{project.description}</p>
                </div>
                <div className="relative">
                    <button
                        onClick={() => setShowActions(!showActions)}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <MoreVertical className="h-5 w-5" />
                    </button>
                    {showActions && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                            {onView && (
                                <button
                                    onClick={() => onView(project)}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    View Project
                                </button>
                            )}
                            {onEdit && (
                                <button
                                    onClick={() => onEdit(project)}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    Edit Project
                                </button>
                            )}
                            {onDelete && (
                                <button
                                    onClick={() => onDelete(project)}
                                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                >
                                    Delete Project
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {/* Progress Bar */}
                    <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                            <span>{project.progress}% Complete</span>
                            <span
                                className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                                    project.status
                                )}`}
                            >
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
    );
};
