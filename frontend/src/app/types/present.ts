// types/present/index.ts
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

export interface TimelineEvent {
    id: number;
    title: string;
    date: string;
    status: 'completed' | 'current' | 'upcoming';
    assignee?: string;
    comments?: number;
    subEvents?: Array<{
        id: number;
        title: string;
        status: 'completed' | 'pending';
    }>;
}
export interface ProjectMetric {
    category: string;
    value: number | string;
    trend: string;
    trendValue: number;
    icon: React.ElementType;
    chartData?: Array<{ date: string; value: number }>;
}
export interface ActivityItem {
    id: number;
    type: 'update' | 'comment' | 'meeting' | 'milestone';
    message: string;
    timestamp: string;
    user?: string;
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

export type ViewableItem = Document | Mockup;
