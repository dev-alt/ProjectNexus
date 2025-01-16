import { ProjectData, Document, TeamMember, Mockup, TimelineEvent, ProjectMetric, ActivityItem, ViewableItem, Project } from '@/types/present';

export interface PresentPageProps {
    params: { id: string };
}
export interface APIDocument {
    id: string;
    type: string;
    title: string;
    updatedAt: string;
    projectId: string;
}

export type PresentDocument = Document;
export type PresentTeamMember = TeamMember;

export type { ProjectData, Mockup, TimelineEvent, ProjectMetric, ActivityItem, ViewableItem, Project };



