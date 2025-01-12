import { LucideIcon } from 'lucide-react';

export interface StatsCard {
    title: string;
    value: string;
    description: string;
    icon: LucideIcon;
    trend: string;
    trendDirection?: 'up' | 'down';
}

export interface Activity {
    id: number;
    action: string;
    project: string;
    time: string;
    user: string;
    type?: 'document' | 'project' | 'team';
}

export interface QuickAction {
    label: string;
    icon: LucideIcon;
    onClick: () => void;
    variant?: 'primary' | 'secondary';
}

export interface ProjectSummary {
    label: string;
    value: string;
    trendValue?: string;
    trendLabel?: string;
}