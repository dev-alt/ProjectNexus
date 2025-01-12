// types/project.ts
export interface TeamMember {
    id: number;
    name: string;
    role: string;
    avatar: string;
}

export interface Document {
    id: number;
    type: string;
    title: string;
    lastModified: string;
    preview: string;
}

export interface Mockup {
    id: number;
    title: string;
    type: string;
    preview: string;
    tool: string;
}

export interface ProjectData {
    id: number;
    name: string;
    description: string;
    status: string;
    progress: number;
    startDate: string;
    endDate: string;
    thumbnail: string;
    team: TeamMember[];
    documents: Document[];
    mockups: Mockup[];
}