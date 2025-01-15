// types/team.ts
export type TeamMemberStatus = 'Active' | 'Away' | 'Offline';
export type TeamMemberRole = 'owner' | 'member' | 'viewer';

export interface TeamMember {
    id: string;
    userId: string;
    name: string;
    email: string;
    role: TeamMemberRole;
    department?: string;
    status: TeamMemberStatus;
    avatar?: string;
    projects?: string[];
    createdAt: string;
    updatedAt: string;
}

export interface Team {
    id: string;
    name: string;
    description: string;
    members: TeamMember[];
    lead: string;
    createdAt: string;
    updatedAt: string;
    projectCount: number;
}

export interface TeamInput {
    name: string;
    description: string;
}

export interface TeamMemberInput {
    userId: string;
    role: TeamMemberRole;
}
