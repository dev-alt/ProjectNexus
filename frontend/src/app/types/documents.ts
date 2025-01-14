// app/types/documents.ts
export type DocumentType = 'High-Level Design' | 'Low-Level Design' | 'Technical Spec' | 'Requirements';

export interface Document {
    id: string;
    projectId: string;
    title: string;
    type: DocumentType;
    content: string;
    version: number;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateDocumentInput {
    projectId: string;
    title: string;
    type: DocumentType;
    content: string;
}