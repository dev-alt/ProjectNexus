import React from 'react';
import {
    BookOpen, Layout, FileText, ImageIcon, ChevronRight,
    TrendingUp, Users, Clock, Target, Calendar, MessageSquare
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import EnhancedTimeline from './EnhancedTimeline';
import { Document, Mockup, TimelineEvent, ProjectMetric, ActivityItem } from '@/types/present';

interface ProjectOverviewProps {
    description: string;
    progress: number;
    documents: Document[];
    mockups: Mockup[];
    onDocumentClick?: (doc: Document) => void;
    onMockupClick?: (mockup: Mockup) => void;
}

// Example metrics data
const metrics: ProjectMetric[] = [
    {
        category: 'Progress',
        value: '65%',
        trend: '+10% this month',
        trendValue: 10,
        icon: TrendingUp,
        chartData: [
            { date: 'Jan', value: 20 },
            { date: 'Feb', value: 35 },
            { date: 'Mar', value: 45 },
            { date: 'Apr', value: 65 },
        ]
    },
    {
        category: 'Team Members',
        value: '12',
        trend: '+2 this week',
        trendValue: 2,
        icon: Users,
    },
    {
        category: 'Time Spent',
        value: '320h',
        trend: '40h this week',
        trendValue: 40,
        icon: Clock,
    },
    {
        category: 'Milestones',
        value: '8/12',
        trend: '2 upcoming',
        trendValue: 0,
        icon: Target,
    }
];

// Example timeline data
const timelineEvents: TimelineEvent[] = [
    {
        id: 1,
        title: 'Project Kickoff',
        date: '2024-01-01',
        status: 'completed',
        assignee: 'Sarah Chen',
        comments: 5,
        subEvents: [
            { id: 101, title: 'Team Assembly', status: 'completed' },
            { id: 102, title: 'Initial Planning', status: 'completed' },
        ]
    },
    {
        id: 2,
        title: 'Design Phase',
        date: '2024-02-01',
        status: 'completed',
        assignee: 'Alex Morrison',
        comments: 8,
        subEvents: [
            { id: 201, title: 'UI/UX Design', status: 'completed' },
            { id: 202, title: 'Design Review', status: 'completed' },
        ]
    },
    {
        id: 3,
        title: 'Development Sprint 1',
        date: '2024-03-01',
        status: 'current',
        assignee: 'Michael Scott',
        comments: 3,
        subEvents: [
            { id: 301, title: 'Frontend Setup', status: 'completed' },
            { id: 302, title: 'Backend APIs', status: 'pending' },
        ]
    },
    {
        id: 4,
        title: 'User Testing',
        date: '2024-04-01',
        status: 'upcoming',
        assignee: 'Sarah Chen',
        subEvents: [
            { id: 401, title: 'Beta Testing', status: 'pending' },
            { id: 402, title: 'Feedback Collection', status: 'pending' },
        ]
    },
];

// Example activity data
const recentActivity: ActivityItem[] = [
    {
        id: 1,
        type: 'update',
        message: 'Sarah Chen updated the design mockups',
        timestamp: '2h ago',
        user: 'Sarah Chen'
    },
    {
        id: 2,
        type: 'comment',
        message: 'New comments on API documentation',
        timestamp: '5h ago'
    },
    {
        id: 3,
        type: 'meeting',
        message: 'Team meeting scheduled for tomorrow',
        timestamp: '1d ago'
    }
];

export default function ProjectOverview({
                                            description,
                                            progress,
                                            documents,
                                            mockups,
                                            onDocumentClick,
                                            onMockupClick,
                                        }: ProjectOverviewProps) {
    const handleTimelineEventClick = (event: TimelineEvent) => {
        console.log('Timeline event clicked:', event);
    };

    const getActivityIcon = (type: ActivityItem['type']) => {
        switch (type) {
            case 'update':
                return <Users className="h-4 w-4 mr-2 text-blue-500" />;
            case 'comment':
                return <MessageSquare className="h-4 w-4 mr-2 text-green-500" />;
            case 'meeting':
                return <Calendar className="h-4 w-4 mr-2 text-purple-500" />;
            case 'milestone':
                return <Target className="h-4 w-4 mr-2 text-yellow-500" />;
        }
    };

    return (
        <div className="space-y-4">
            {/* Quick Stats */}
            <div className="grid grid-cols-4 gap-4">
                {metrics.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={index} className="hover:shadow-sm transition-shadow">
                            <CardContent className="p-3">
                                <div className="flex items-center justify-between">
                                    <Icon className="h-4 w-4 text-gray-500" />
                                    <span className="text-xs text-green-600">{stat.trend}</span>
                                </div>
                                <div className="mt-2">
                                    <p className="text-lg font-bold">{stat.value}</p>
                                    <p className="text-xs text-gray-500">{stat.category}</p>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-12 gap-4">
                {/* Left Column - Project Overview */}
                <div className="col-span-8">
                    <Card className="hover:shadow-sm transition-shadow">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base flex items-center justify-between">
                                Project Overview
                                <span className="text-xs font-normal text-gray-500">
                                    Last updated: {new Date().toLocaleDateString()}
                                </span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-600">{description}</p>
                            <div className="mt-4">
                                <div className="flex justify-between items-center text-sm mb-1">
                                    <span className="font-medium">Overall Progress</span>
                                    <span className="text-blue-600 font-medium">{progress}%</span>
                                </div>
                                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-blue-600 rounded-full transition-all duration-500"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                                <div className="mt-1 flex justify-between text-xs text-gray-500">
                                    <span>Started Jan 1, 2024</span>
                                    <span>Target: June 30, 2024</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column - Timeline */}
                <div className="col-span-4">
                    <EnhancedTimeline
                        events={timelineEvents}
                        onEventClick={handleTimelineEventClick}
                    />
                </div>

                {/* Progress Trend and Activity */}
                <div className="col-span-8">
                    <div className="grid grid-cols-2 gap-4">
                        {/* Recent Documents */}
                        <Card className="hover:shadow-sm transition-shadow">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm flex items-center justify-between">
                                    <div className="flex items-center">
                                        <BookOpen className="h-4 w-4 mr-2" />
                                        Recent Documents
                                    </div>
                                    <button className="text-blue-600 text-xs hover:underline">View All</button>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <div className="space-y-1">
                                    {documents.slice(0, 3).map((doc) => (
                                        <div
                                            key={doc.id}
                                            onClick={() => onDocumentClick?.(doc)}
                                            className="flex items-center p-2 rounded hover:bg-gray-50 cursor-pointer group"
                                        >
                                            <FileText className="h-4 w-4 text-gray-500 group-hover:text-blue-500 mr-2" />
                                            <div className="flex-grow min-w-0">
                                                <p className="text-sm font-medium truncate">{doc.title}</p>
                                                <p className="text-xs text-gray-500">{doc.type}</p>
                                            </div>
                                            <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-blue-500" />
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Recent Mockups */}
                        <Card className="hover:shadow-sm transition-shadow">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm flex items-center justify-between">
                                    <div className="flex items-center">
                                        <Layout className="h-4 w-4 mr-2" />
                                        Recent Mockups
                                    </div>
                                    <button className="text-blue-600 text-xs hover:underline">View All</button>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <div className="space-y-1">
                                    {mockups.slice(0, 3).map((mockup) => (
                                        <div
                                            key={mockup.id}
                                            onClick={() => onMockupClick?.(mockup)}
                                            className="flex items-center p-2 rounded hover:bg-gray-50 cursor-pointer group"
                                        >
                                            <ImageIcon className="h-4 w-4 text-gray-500 group-hover:text-blue-500 mr-2" />
                                            <div className="flex-grow min-w-0">
                                                <p className="text-sm font-medium truncate">{mockup.title}</p>
                                                <p className="text-xs text-gray-500">{mockup.type}</p>
                                            </div>
                                            <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-blue-500" />
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Activity Feed */}
                <div className="col-span-4">
                    <Card className="hover:shadow-sm transition-shadow">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm">Recent Activity</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <div className="space-y-2">
                                {recentActivity.map((activity) => (
                                    <div key={activity.id} className="flex items-center text-sm">
                                        {getActivityIcon(activity.type)}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm truncate">{activity.message}</p>
                                            <p className="text-xs text-gray-500">{activity.timestamp}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/*/!* Progress Trend *!/*/}
            {/*<ProjectMetrics metrics={metrics} />*/}
        </div>
    );
}
