// lib/hooks/use-project-options.ts
import { useState, useEffect } from 'react';
import { projectApi } from '@/lib/api/projects';

export interface ProjectOption {
    value: string;
    label: string;
}

export function useProjectOptions() {
    const [projectOptions, setProjectOptions] = useState<ProjectOption[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchProjects = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const projects = await projectApi.list();
                const options = projects.map(project => ({
                    value: project.id,
                    label: project.name
                }));
                setProjectOptions(options);
            } catch (err) {
                setError(err instanceof Error ? err : new Error('Failed to fetch projects'));
                console.error('Error fetching projects:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProjects();
    }, []);

    return { projectOptions, isLoading, error };
}
