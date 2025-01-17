// types/mockup.ts
export type MockupType = 'Wireframe' | 'Prototype' | 'High-fidelity';
export type MockupStatus = 'Draft' | 'In Review' | 'Approved';

export interface Mockup {
    id: string;
    projectId: string;
    name: string;
    type: MockupType;
    tool: string;
    thumbnail?: string;
    status: MockupStatus;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
}
