// app/hooks/use-mockups.ts
import { useState, useEffect, useCallback } from 'react';
import { mockupApi } from '@/lib/api/mockups';
import { useToast } from '@/lib/hooks/use-toast';
import { Mockup } from '@/types/mockup';
import type { CreateMockupInput, UpdateMockupInput } from '@/lib/api/mockups';

interface State {
    mockups: Mockup[];
    error: Error | null;
    isLoading: boolean;
    isCreating: boolean;
    isUpdating: Record<string, boolean>;
    isDeleting: Record<string, boolean>;
}

export function useMockups(projectId?: string) {
    const [state, setState] = useState<State>({
        mockups: [],
        error: null,
        isLoading: true,
        isCreating: false,
        isUpdating: {},
        isDeleting: {}
    });
    const { toast } = useToast();

    const fetchMockups = useCallback(async () => {
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        try {
            const data = projectId
                ? await mockupApi.getByProject(projectId)
                : await mockupApi.getAll();
            setState(prev => ({ ...prev, mockups: data, isLoading: false }));
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to fetch mockups';
            setState(prev => ({
                ...prev,
                error: new Error(errorMessage),
                isLoading: false
            }));
            toast({
                title: 'Error',
                description: errorMessage,
                variant: 'destructive',
            });
        }
    }, [projectId, toast]);

    const createMockup = async (input: CreateMockupInput) => {
        setState(prev => ({ ...prev, isCreating: true, error: null }));
        try {
            const newMockup = await mockupApi.create(input);
            setState(prev => ({
                ...prev,
                mockups: [...prev.mockups, newMockup],
                isCreating: false
            }));
            toast({
                title: 'Success',
                description: 'Mockup created successfully',
                variant: 'success',
            });
            return newMockup;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to create mockup';
            setState(prev => ({
                ...prev,
                error: new Error(errorMessage),
                isCreating: false
            }));
            toast({
                title: 'Error',
                description: errorMessage,
                variant: 'destructive',
            });
            throw error;
        }
    };

    const updateMockup = async (id: string, input: UpdateMockupInput) => {
        setState(prev => ({
            ...prev,
            isUpdating: { ...prev.isUpdating, [id]: true },
            error: null
        }));
        try {
            const updatedMockup = await mockupApi.update(id, input);
            setState(prev => ({
                ...prev,
                mockups: prev.mockups.map(mockup =>
                    mockup.id === id ? updatedMockup : mockup
                ),
                isUpdating: { ...prev.isUpdating, [id]: false }
            }));
            toast({
                title: 'Success',
                description: 'Mockup updated successfully',
                variant: 'success',
            });
            return updatedMockup;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to update mockup';
            setState(prev => ({
                ...prev,
                error: new Error(errorMessage),
                isUpdating: { ...prev.isUpdating, [id]: false }
            }));
            toast({
                title: 'Error',
                description: errorMessage,
                variant: 'destructive',
            });
            throw error;
        }
    };

    const deleteMockup = async (id: string) => {
        setState(prev => ({
            ...prev,
            isDeleting: { ...prev.isDeleting, [id]: true },
            error: null
        }));
        try {
            await mockupApi.delete(id);
            setState(prev => ({
                ...prev,
                mockups: prev.mockups.filter(mockup => mockup.id !== id),
                isDeleting: { ...prev.isDeleting, [id]: false }
            }));
            toast({
                title: 'Success',
                description: 'Mockup deleted successfully',
                variant: 'success',
            });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to delete mockup';
            setState(prev => ({
                ...prev,
                error: new Error(errorMessage),
                isDeleting: { ...prev.isDeleting, [id]: false }
            }));
            toast({
                title: 'Error',
                description: errorMessage,
                variant: 'destructive',
            });
            throw error;
        }
    };

    useEffect(() => {
        void fetchMockups();
    }, [fetchMockups]);

    return {
        mockups: state.mockups,
        error: state.error,
        isLoading: state.isLoading,
        isCreating: state.isCreating,
        isUpdating: state.isUpdating,
        isDeleting: state.isDeleting,
        createMockup,
        updateMockup,
        deleteMockup,
        refreshMockups: fetchMockups,
    };
}
