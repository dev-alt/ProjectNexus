// lib/hooks/use-team.ts
import { useState, useCallback } from 'react';
import { TeamMember } from '@/types/team';
import { teamApi } from '@/lib/api/team';
import { useToast } from '@/lib/hooks/use-toast';

export function useTeam(projectId: string) {
    const [members, setMembers] = useState<TeamMember[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const fetchTeam = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await teamApi.getProjectTeam(projectId);
            setMembers(data);
        } catch (error) {
            toast({
                title: 'Error',
                description: error instanceof Error ? error.message : 'Failed to fetch team members',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    }, [projectId, toast]);

    const addMember = async (userId: string, role: string) => {
        try {
            setIsLoading(true);
            await teamApi.addTeamMember(projectId, userId, role);
            await fetchTeam();
            toast({
                title: 'Success',
                description: 'Team member added successfully',
                variant: 'success',
            });
        } catch (error) {
            toast({
                title: 'Error',
                description: error instanceof Error ? error.message : 'Failed to add team member',
                variant: 'destructive',
            });
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const updateMember = async (memberId: string, data: { role?: string; status?: string }) => {
        try {
            setIsLoading(true);
            await teamApi.updateTeamMember(projectId, memberId, data);
            await fetchTeam();
            toast({
                title: 'Success',
                description: 'Team member updated successfully',
                variant: 'success',
            });
        } catch (error) {
            toast({
                title: 'Error',
                description: error instanceof Error ? error.message : 'Failed to update team member',
                variant: 'destructive',
            });
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const removeMember = async (memberId: string) => {
        try {
            setIsLoading(true);
            await teamApi.removeTeamMember(projectId, memberId);
            await fetchTeam();
            toast({
                title: 'Success',
                description: 'Team member removed successfully',
                variant: 'success',
            });
        } catch (error) {
            toast({
                title: 'Error',
                description: error instanceof Error ? error.message : 'Failed to remove team member',
                variant: 'destructive',
            });
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        members,
        isLoading,
        refreshTeam: fetchTeam,
        addMember,
        updateMember,
        removeMember,
    };
}
