// lib/api/mockups.ts
import type { Mockup, MockupType, MockupStatus } from '@/types/mockup';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8085/api/v1';

export interface CreateMockupInput {
    projectId: string;
    name: string;
    type: MockupType;
    tool: string;
    status: MockupStatus;
    thumbnail?: string;
}

export interface UpdateMockupInput {
    name?: string;
    type?: MockupType;
    tool?: string;
    status?: MockupStatus;
    thumbnail?: string;
}

class ApiError extends Error {
    constructor(message: string, public status?: number, public data?: any) {
        super(message);
        this.name = 'ApiError';
    }
}

async function handleResponse<T>(response: Response): Promise<T> {
    const data = await response.text();
    console.log('Response status:', response.status);
    console.log('Response data:', data);

    if (!response.ok) {
        let errorMessage = 'API request failed';
        try {
            const errorData = JSON.parse(data);
            errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (e) {
            errorMessage = data || errorMessage;
        }
        throw new ApiError(errorMessage, response.status);
    }

    try {
        return JSON.parse(data);
    } catch (e) {
        throw new ApiError('Invalid response format from server');
    }
}

function getAuthToken(): string {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new ApiError('Authentication token not found');
    }
    return token;
}

export const mockupApi = {
    async create(input: CreateMockupInput): Promise<Mockup> {
        console.log('Creating mockup with input:', input);

        const response = await fetch(`${API_URL}/mockups`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...input,
                createdBy: 'Current User', // This should come from auth context
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            }),
        });

        return handleResponse<Mockup>(response);
    },

    async getAll(): Promise<Mockup[]> {
        // For development, return mock data if no token is present
        try {
            getAuthToken();
        } catch {
            return [{
                id: '1',
                projectId: 'project-1',
                name: 'Sample Mockup',
                type: 'Wireframe',
                tool: 'Figma',
                status: 'Draft',
                createdBy: 'Test User',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            }];
        }

        const response = await fetch(`${API_URL}/mockups`, {
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`,
                'Content-Type': 'application/json',
            },
        });

        try {
            return handleResponse<Mockup[]>(response);
        } catch (error) {
            console.error('Error fetching mockups:', error);
            // Return empty array instead of throwing error for better UX
            return [];
        }
    },

    async update(id: string, input: UpdateMockupInput): Promise<Mockup> {
        const response = await fetch(`${API_URL}/mockups/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...input,
                updatedAt: new Date().toISOString(),
            }),
        });

        return handleResponse<Mockup>(response);
    },

    async delete(id: string): Promise<void> {
        const response = await fetch(`${API_URL}/mockups/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`,
                'Content-Type': 'application/json',
            },
        });

        await handleResponse<void>(response);
    },

    async getByProject(projectId: string): Promise<Mockup[]> {
        const response = await fetch(`${API_URL}/mockups/project/${projectId}`, {
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`,
                'Content-Type': 'application/json',
            },
        });

        return handleResponse<Mockup[]>(response);
    },
};
