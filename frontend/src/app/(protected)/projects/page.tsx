// app/projects/page.tsx
'use client';

import { useState } from 'react';
import { ProjectHeader } from '@/components/projects/ProjectHeader';
import { ProjectSearch } from '@/components/projects/ProjectSearch';
import { ProjectGrid } from '@/components/projects/ProjectGrid';
import ProjectForm from '@/components/projects/ProjectForm';
import DeleteProjectDialog from '@/components/projects/DeleteProjectDialog';
import { Project } from '@/types/types';

// Mock data - replace with API call in production
const initialProjects = [
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
    const [projects, setProjects] = useState(initialProjects);
    const [showNewProjectModal, setShowNewProjectModal] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [deletingProject, setDeletingProject] = useState<Project | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const filteredProjects = projects.filter(project =>
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleCreateProject = async (projectData: Omit<Project, 'id' | 'lastUpdated' | 'documents'>) => {
        setIsLoading(true);
        try {
            // In a real app, this would be an API call
            const newProject = {
                ...projectData,
                id: Math.max(...projects.map(p => p.id)) + 1,
                lastUpdated: new Date().toISOString(),
                documents: 0,
            };
            setProjects([...projects, newProject]);
            setShowNewProjectModal(false);
        } catch (error) {
            console.error('Failed to create project:', error);
            // Handle error (show toast notification, etc.)
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditProject = async (projectData: Omit<Project, 'id' | 'lastUpdated' | 'documents'>) => {
        if (!editingProject) return;

        setIsLoading(true);
        try {
            // In a real app, this would be an API call
            const updatedProjects = projects.map(project =>
                project.id === editingProject.id
                    ? {
                        ...project,
                        ...projectData,
                        lastUpdated: new Date().toISOString(),
                    }
                    : project
            );
            setProjects(updatedProjects);
            setEditingProject(null);
        } catch (error) {
            console.error('Failed to update project:', error);
            // Handle error (show toast notification, etc.)
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteProject = async () => {
        if (!deletingProject) return;

        setIsLoading(true);
        try {
            // In a real app, this would be an API call
            const updatedProjects = projects.filter(
                project => project.id !== deletingProject.id
            );
            setProjects(updatedProjects);
            setDeletingProject(null);
        } catch (error) {
            console.error('Failed to delete project:', error);
            // Handle error (show toast notification, etc.)
        } finally {
            setIsLoading(false);
        }
    };

    const handleViewProject = (project: Project) => {
        // Navigate to project detail page
        window.location.href = `/projects/${project.id}`;
    };

    return (
        <div className="space-y-6">
            <ProjectHeader onCreateNew={() => setShowNewProjectModal(true)} />
            <ProjectSearch value={searchQuery} onChange={setSearchQuery} />
            <ProjectGrid
                projects={filteredProjects}
                onEditProject={setEditingProject}
                onDeleteProject={setDeletingProject}
                onViewProject={handleViewProject}
            />

            {/* Project Form Modal */}
            {(showNewProjectModal || editingProject) && (
                <ProjectForm
                    initialData={editingProject || undefined}
                    onSubmit={editingProject ? handleEditProject : handleCreateProject}
                    onClose={() => {
                        setShowNewProjectModal(false);
                        setEditingProject(null);
                    }}
                    isLoading={isLoading}
                />
            )}

            {/* Delete Confirmation Dialog */}
            {deletingProject && (
                <DeleteProjectDialog
                    project={deletingProject}
                    onConfirm={handleDeleteProject}
                    onCancel={() => setDeletingProject(null)}
                    isDeleting={isLoading}
                />
            )}
        </div>
    );
}