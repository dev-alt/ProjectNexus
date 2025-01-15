// app/types/documents.ts

export type DocumentStatus = 'Draft' | 'In Review' | 'Approved' | 'Rejected';

export type DocumentType =
    | 'High-Level Design'
    | 'Low-Level Design'
    | 'Architecture'
    | 'Technical Spec'
    | 'Requirements';

export interface Document {
    id: string;
    projectId: string;
    title: string;
    type: DocumentType;
    content: string;
    version: number;
    status: DocumentStatus;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    author?: string; // For compatibility with existing UI
}

export interface DocumentVersion {
    id: string;
    documentId: string;
    version: number;
    content: string;
    createdBy: string;
    createdAt: string;
}

export interface DocumentFormData {
    title: string;
    type: DocumentType;
    project: string;
    content: string;
    status: DocumentStatus;
}

export interface CreateDocumentInput {
    projectId: string;
    title: string;
    type: DocumentType;
    content: string;
    status: DocumentStatus;
}

export interface UpdateDocumentInput {
    title?: string;
    type?: DocumentType;
    content?: string;
    status?: DocumentStatus;
}
