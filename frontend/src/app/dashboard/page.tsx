// app/dashboard/page.tsx
'use client';

import { FileText, Users, Clock, Award, Plus, UserPlus, FileText as FileTextIcon } from 'lucide-react';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { ProjectOverview } from '@/components/dashboard/ProjectOverview';
import { useRouter } from 'next/navigation';
import { StatsCard, Activity, QuickAction, ProjectSummary } from '@/types/dashboard';

const statsCards: StatsCard[] = [
    {
        title: 'Active Projects',
        value: '12',
        description: 'Projects in progress',
        icon: FileText,
        trend: '+2 this week',
        trendDirection: 'up'
    },
    {
        title: 'Team Members',
        value: '24',
        description: 'Across all projects',
        icon: Users,
        trend: '+3 this month',
        trendDirection: 'up'
    },
    {
        title: 'Recent Updates',
        value: '48',
        description: 'In the last 7 days',
        icon: Clock,
        trend: '15% increase',
        trendDirection: 'up'
    },
    {
        title: 'Completed Projects',
        value: '32',
        description: 'Successfully delivered',
        icon: Award,
        trend: '+5 this quarter',
        trendDirection: 'up'
    }
];

const recentActivity: Activity[] = [
    {
        id: 1,
        action: "Updated high-level design document",
        project: "E-commerce Platform",
        time: "2 hours ago",
        user: "Alex Morrison",
        type: 'document'
    },
    {
        id: 2,
        action: "Created new project",
        project: "Mobile App Redesign",
        time: "5 hours ago",
        user: "Sarah Chen",
        type: 'project'
    },
    {
        id: 3,
        action: "Added team member",
        project: "API Integration",
        time: "1 day ago",
        user: "Michael Scott",
        type: 'team'
    }
];

const projectSummaries: ProjectSummary[] =  [
    {
        label: "Active Projects",
        value: "12 total",
        trendValue: "+2",
        trendLabel: "from last month"
    },
    {
        label: "Pending Reviews",
        value: "5 documents",
        trendValue: "-1",
        trendLabel: "from last week"
    },
    {
        label: "Upcoming Deadlines",
        value: "3 this week",
        trendValue: "+1",
        trendLabel: "from last week"
    }
];


export default function DashboardPage() {
    const router = useRouter();

    const quickActions: QuickAction[] = [
        {
            label: "Create New Project",
            icon: Plus,
            onClick: () => router.push('/projects/new'),
            variant: 'primary' as const
        },
        {
            label: "Add Team Member",
            icon: UserPlus,
            onClick: () => router.push('/team'),
            variant: 'secondary' as const
        },
        {
            label: "Start Documentation",
            icon: FileTextIcon,
            onClick: () => router.push('/documents/new'),
            variant: 'secondary' as const
        }
    ];
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold">Dashboard</h1>
            </div>

            {/* Stats Grid */}
            <DashboardStats cards={statsCards} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Activity Feed */}
                <ActivityFeed activities={recentActivity} />

                <div className="space-y-6">
                    {/* Project Overview */}
                    <ProjectOverview summaries={projectSummaries} />

                    {/* Quick Actions */}
                    <QuickActions actions={quickActions} />
                </div>
            </div>
        </div>
    );
}