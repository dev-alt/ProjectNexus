// app/hooks/use-projects.ts
import { useState, useEffect, useCallback } from 'react';
import { projectApi } from '@/lib/api/projects';
import type { Project } from '@/types/project';
import { useToast } from '@/lib/hooks/use-toast';

export function useProjects() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const fetchProjects = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await projectApi.list();
            setProjects(data);
        } catch (error) {
            toast({
                title: 'Error',
                description: error instanceof Error ? error.message : 'Failed to fetch projects',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        void fetchProjects();
    }, [fetchProjects]);

    return {
        projects,
        isLoading,
        refreshProjects: fetchProjects
    };
}
