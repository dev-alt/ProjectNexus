// app/lib/api/documents.ts

import {DocumentVersion} from "@/types/documents";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8085/api/v1';

interface CreateDocumentInput {
    projectId: string;
    title: string;
    type: string;
    content: string;
}

interface UpdateDocumentInput {
    title?: string;
    type?: string;
    content?: string;
}

export const documentsApi = {
    async create(input: CreateDocumentInput): Promise<Document> {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/documents`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(input),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to create document');
        }

        return response.json();
    },

    async getAll(): Promise<Document[]> {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/documents`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to fetch documents');
        }

        return response.json();
    },

    async getById(id: string): Promise<Document> {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/documents/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to fetch document');
        }

        return response.json();
    },

    async update(id: string, input: UpdateDocumentInput): Promise<Document> {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/documents/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(input),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to update document');
        }

        return response.json();
    },

    async delete(id: string): Promise<void> {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/documents/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to delete document');
        }
    },

    async getByProject(projectId: string): Promise<Document[]> {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/documents/project/${projectId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to fetch project documents');
        }

        return response.json();
    },

    async getVersions(id: string): Promise<DocumentVersion[]> {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/documents/${id}/versions`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to fetch document versions');
        }

        return response.json();
    },
};
