// lib/api/team.ts
import { TeamMember } from '@/types/team';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8085/api/v1';

interface Team {
    id: string;
    name: string;
    description: string;
    members: TeamMember[];
    lead: string;
    createdAt: string;
    updatedAt: string;
    projectCount?: number;
}

interface CreateTeamInput {
    name: string;
    description: string;
}

interface UpdateTeamInput {
    name?: string;
    description?: string;
    lead?: string;
}

export const teamApi = {
    // Get all teams
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

    // Get team by ID
    getTeam: async (teamId: string): Promise<Team> => {
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

    // Create new team
    createTeam: async (data: CreateTeamInput): Promise<Team> => {
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

    // Update team
    updateTeam: async (teamId: string, data: UpdateTeamInput): Promise<Team> => {
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

    // Delete team
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

    // Get team members
    getProjectTeam: async (projectId: string): Promise<TeamMember[]> => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/projects/${projectId}/team`, {
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

    // Add team member
    addTeamMember: async (projectId: string, userId: string, role: string): Promise<TeamMember> => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/projects/${projectId}/team`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, role }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to add team member');
        }

        return response.json();
    },

    // Update team member
    updateTeamMember: async (projectId: string, memberId: string, data: { role?: string; status?: string }): Promise<TeamMember> => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/projects/${projectId}/team/${memberId}`, {
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

    // Remove team member
    removeTeamMember: async (projectId: string, memberId: string): Promise<void> => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/projects/${projectId}/team/${memberId}`, {
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
