// lib/api/team.ts
import { Team, TeamMember } from '@/types/team';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8085/api/v1';

export const teamApi = {
    // Team management endpoints
    getAllTeams: async (): Promise<Team[]> => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/teams`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to fetch teams');
        }

        return response.json();
    },

    getTeamById: async (teamId: string): Promise<Team> => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/teams/${teamId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to fetch team');
        }

        return response.json();
    },

    createTeam: async (data: { name: string; description: string }): Promise<Team> => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/teams`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to create team');
        }

        return response.json();
    },

    updateTeam: async (teamId: string, data: Partial<Team>): Promise<Team> => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/teams/${teamId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to update team');
        }

        return response.json();
    },

    deleteTeam: async (teamId: string): Promise<void> => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/teams/${teamId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to delete team');
        }
    },

    // Team members endpoints
    getTeamMembers: async (teamId: string): Promise<TeamMember[]> => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/teams/${teamId}/members`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to fetch team members');
        }

        return response.json();
    },

    addTeamMember: async (teamId: string, data: { userId: string; role: string }): Promise<TeamMember> => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/teams/${teamId}/members`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to add team member');
        }

        return response.json();
    },

    updateTeamMember: async (teamId: string, memberId: string, data: { role?: string; status?: string }): Promise<TeamMember> => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/teams/${teamId}/members/${memberId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to update team member');
        }

        return response.json();
    },

    removeTeamMember: async (teamId: string, memberId: string): Promise<void> => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/teams/${teamId}/members/${memberId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to remove team member');
        }
    },
};
