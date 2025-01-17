// lib/hooks/use-teams.ts
import { useState, useCallback } from 'react';
import { Team } from '@/types/team';
import { teamApi } from '@/lib/api/team';
import { useToast } from '@/lib/hooks/use-toast';

export function useTeams() {
    const [teams, setTeams] = useState<Team[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const fetchTeams = useCallback(async () => {
        try {
            setIsLoading(true);
            const rawTeams = await teamApi.getAllTeams();
            // Transform the raw teams data to match the expected interface if needed
            const formattedTeams = rawTeams.map(team => ({
                id: team.id,
                name: team.name,
                description: team.description,
                members: team.members,
                lead: team.lead,
                createdAt: team.createdAt,
                updatedAt: team.updatedAt,
                projectCount: team.projectCount ?? 0
            }));
            setTeams(formattedTeams);
        } catch (error) {
            toast({
                title: 'Error',
                description: error instanceof Error ? error.message : 'Failed to fetch teams',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    }, [toast]);

    const createTeam = async (teamData: { name: string; description: string }) => {
        try {
            setIsLoading(true);
            await teamApi.createTeam(teamData);
            await fetchTeams();
            toast({
                title: 'Success',
                description: 'Team created successfully',
                variant: 'success',
            });
        } catch (error) {
            toast({
                title: 'Error',
                description: error instanceof Error ? error.message : 'Failed to create team',
                variant: 'destructive',
            });
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const updateTeam = async (teamId: string, teamData: Partial<Team>) => {
        try {
            setIsLoading(true);
            await teamApi.updateTeam(teamId, teamData);
            await fetchTeams();
            toast({
                title: 'Success',
                description: 'Team updated successfully',
                variant: 'success',
            });
        } catch (error) {
            toast({
                title: 'Error',
                description: error instanceof Error ? error.message : 'Failed to update team',
                variant: 'destructive',
            });
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const deleteTeam = async (teamId: string) => {
        try {
            setIsLoading(true);
            await teamApi.deleteTeam(teamId);
            await fetchTeams();
            toast({
                title: 'Success',
                description: 'Team deleted successfully',
                variant: 'success',
            });
        } catch (error) {
            toast({
                title: 'Error',
                description: error instanceof Error ? error.message : 'Failed to delete team',
                variant: 'destructive',
            });
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        teams,
        isLoading,
        refreshTeams: fetchTeams,
        createTeam,
        updateTeam,
        deleteTeam,
    };
}
