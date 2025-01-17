// app/lib/api/projects.ts
import { Project } from '@/types/project';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8085/api/v1';

export interface CreateProjectInput {
    name: string;
    description: string;
    status: string;
    team?: number;
    progress?: number;
}

export interface UpdateProjectInput {
    name?: string;
    description?: string;
    status?: string;
    progress?: number;
}

interface ProjectResponse {
    id: string;
    name: string;
    description: string;
    status: string;
    progress: number;
    team: string[];
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    documents_count?: number;
}

// Convert API response to frontend Project type
function mapProjectResponse(project: ProjectResponse): Project {
    return {
        id: project.id,
        name: project.name,
        description: project.description,
        status: project.status,
        team: project.team.length,
        documents: project.documents_count || 0,
        lastUpdated: project.updatedAt,
        startDate: '',
        endDate: '',
        progress: project.progress
    };
}

class ApiError extends Error {
    constructor(message: string, public statusCode?: number) {
        super(message);
        this.name = 'ApiError';
    }
}

export const projectApi = {
    async list(): Promise<Project[]> {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new ApiError('No authentication token found');
        }

        const response = await fetch(`${API_URL}/projects`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const error = await response.json();
            throw new ApiError(error.message || 'Failed to fetch projects', response.status);
        }

        const data: ProjectResponse[] = await response.json();
        return data.map(mapProjectResponse);
    },

    async get(id: string): Promise<Project> {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new ApiError('No authentication token found');
        }

        const response = await fetch(`${API_URL}/projects/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const error = await response.json();
            throw new ApiError(error.message || 'Failed to fetch project', response.status);
        }

        const data: ProjectResponse = await response.json();
        return mapProjectResponse(data);
    },

    async create(input: CreateProjectInput): Promise<Project> {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new ApiError('No authentication token found');
        }

        const response = await fetch(`${API_URL}/projects`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(input),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new ApiError(error.message || 'Failed to create project', response.status);
        }

        const data: ProjectResponse = await response.json();
        return mapProjectResponse(data);
    },

    async update(id: string, input: UpdateProjectInput): Promise<Project> {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new ApiError('No authentication token found');
        }

        const response = await fetch(`${API_URL}/projects/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(input),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new ApiError(error.message || 'Failed to update project', response.status);
        }

        const data: ProjectResponse = await response.json();
        return mapProjectResponse(data);
    },

    async delete(id: string): Promise<void> {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new ApiError('No authentication token found');
        }

        const response = await fetch(`${API_URL}/projects/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        });

        if (!response.ok) {
            const error = await response.json();
            throw new ApiError(error.message || 'Failed to delete project', response.status);
        }
    }
};
