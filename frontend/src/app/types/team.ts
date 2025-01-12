// types/team.ts
export interface TeamMember {
    id: number;
    name: string;
    role: string;
    email: string;
    department: string;
    projects: string[];
    avatar: string;
    status: 'Active' | 'Away' | 'Offline';
}