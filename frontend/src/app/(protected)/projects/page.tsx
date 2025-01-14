// app/projects/page.tsx
'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ProjectHeader } from '@/components/projects/ProjectHeader';
import { ProjectSearch } from '@/components/projects/ProjectSearch';
import { ProjectGrid } from '@/components/projects/ProjectGrid';
import ProjectForm from '@/components/projects/ProjectForm';
import DeleteProjectDialog from '@/components/projects/DeleteProjectDialog';
import { Project } from '@/types/types';
import { projectApi, CreateProjectInput, UpdateProjectInput } from '@/lib/api/projects';
import { useToast } from '@/lib/hooks/use-toast';

export default function ProjectsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [projects, setProjects] = useState<Project[]>([]);
    const [showNewProjectModal, setShowNewProjectModal] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [deletingProject, setDeletingProject] = useState<Project | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const { toast } = useToast();
    const router = useRouter();

    const fetchProjects = useCallback(async () => {
        try {
            const data = await projectApi.list();
            setProjects(data);
        } catch (error) {
            toast({
                title: 'Error',
                description: error instanceof Error ? error.message : 'Failed to fetch projects',
                variant: 'destructive',
            });
        } finally {
            setInitialLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        const loadProjects = async () => {
            try {
                await fetchProjects();
            } catch (error) {
                console.error('Failed to load projects:', error);
            }
        };

        void loadProjects();
    }, [fetchProjects]);

    const filteredProjects = projects.filter(project =>
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleCreateProject = async (projectData: CreateProjectInput) => {
        setIsLoading(true);
        try {
            const newProject = await projectApi.create(projectData);
            setProjects(prev => [...prev, newProject]);
            setShowNewProjectModal(false);

            toast({
                title: 'Success',
                description: 'Project created successfully',
                variant: 'success',
            });
        } catch (error) {
            toast({
                title: 'Error',
                description: error instanceof Error ? error.message : 'Failed to create project',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditProject = async (projectData: UpdateProjectInput) => {
        if (!editingProject) return;

        setIsLoading(true);
        try {
            const updatedProject = await projectApi.update(editingProject.id, projectData);
            setProjects(prev => prev.map(project =>
                project.id === editingProject.id ? updatedProject : project
            ));
            setEditingProject(null);

            toast({
                title: 'Success',
                description: 'Project updated successfully',
                variant: 'success',
            });
        } catch (error) {
            toast({
                title: 'Error',
                description: error instanceof Error ? error.message : 'Failed to update project',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteProject = async () => {
        if (!deletingProject) return;

        setIsLoading(true);
        try {
            await projectApi.delete(deletingProject.id);
            setProjects(prev => prev.filter(project => project.id !== deletingProject.id));
            setDeletingProject(null);

            toast({
                title: 'Success',
                description: 'Project deleted successfully',
                variant: 'success',
            });
        } catch (error) {
            toast({
                title: 'Error',
                description: error instanceof Error ? error.message : 'Failed to delete project',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleViewProject = (project: Project) => {
        router.push(`/projects/${project.id}`);
    };

    if (initialLoading) {
        return (
            <div className="h-96 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <ProjectHeader onCreateNew={() => setShowNewProjectModal(true)} />
            <ProjectSearch value={searchQuery} onChange={setSearchQuery} />

            {projects.length === 0 ? (
                <div className="text-center py-12">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">No projects yet</h3>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        Get started by creating your first project.
                    </p>
                    <button
                        onClick={() => setShowNewProjectModal(true)}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Create Project
                    </button>
                </div>
            ) : (
                <ProjectGrid
                    projects={filteredProjects}
                    onEditProject={setEditingProject}
                    onDeleteProject={setDeletingProject}
                    onViewProject={handleViewProject}
                />
            )}

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
