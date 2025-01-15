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
