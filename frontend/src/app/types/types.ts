// types.ts
export interface Document {
    id: number;
    title: string;
    type: string;
    project: string;
    content: string;
    lastModified: string;
    author: string;
    status: string;
}
// Types
export interface Mockup {
    id: number;
    name: string;
    project: string;
    type: string;
    lastModified: string;
    author: string;
    status: string;
    thumbnail: string;
    tool: string;
}
export interface Project {
    id: string;
    name: string;
    description: string;
    status: string;
    team: number;
    documents: number;
    lastUpdated: string;
    progress: number;
}

