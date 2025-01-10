'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Users, Clock, Award } from 'lucide-react';

const statsCards = [
    {
        title: 'Active Projects',
        value: '12',
        description: 'Projects in progress',
        icon: FileText,
        trend: '+2 this week'
    },
    {
        title: 'Team Members',
        value: '24',
        description: 'Across all projects',
        icon: Users,
        trend: '+3 this month'
    },
    {
        title: 'Recent Updates',
        value: '48',
        description: 'In the last 7 days',
        icon: Clock,
        trend: '15% increase'
    },
    {
        title: 'Completed Projects',
        value: '32',
        description: 'Successfully delivered',
        icon: Award,
        trend: '+5 this quarter'
    }
];

const recentActivity = [
    {
        id: 1,
        action: "Updated high-level design document",
        project: "E-commerce Platform",
        time: "2 hours ago",
        user: "Alex Morrison"
    },
    {
        id: 2,
        action: "Created new project",
        project: "Mobile App Redesign",
        time: "5 hours ago",
        user: "Sarah Chen"
    },
    {
        id: 3,
        action: "Added team member",
        project: "API Integration",
        time: "1 day ago",
        user: "Michael Scott"
    }
];

export default function DashboardPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold">Dashboard</h1>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {statsCards.map((card) => {
                    const Icon = card.icon;
                    return (
                        <Card key={card.title}>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-gray-500">
                                    {card.title}
                                </CardTitle>
                                <Icon className="h-4 w-4 text-gray-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{card.value}</div>
                                <p className="text-xs text-gray-600 mt-1">{card.description}</p>
                                <div className="text-xs text-green-600 mt-2">{card.trend}</div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Recent Activity */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {recentActivity.map((activity) => (
                            <div key={activity.id} className="flex items-center justify-between py-3">
                                <div>
                                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                                    <p className="text-sm text-gray-500">{activity.project}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-500">{activity.time}</p>
                                    <p className="text-sm text-gray-900">{activity.user}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Project Overview */}
                <Card>
                    <CardHeader>
                        <CardTitle>Project Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">Active Projects</span>
                                <span className="text-sm text-gray-500">12 total</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">Pending Reviews</span>
                                <span className="text-sm text-gray-500">5 documents</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">Upcoming Deadlines</span>
                                <span className="text-sm text-gray-500">3 this week</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Links */}
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                                Create New Project
                            </button>
                            <button className="w-full bg-white text-gray-900 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50">
                                Add Team Member
                            </button>
                            <button className="w-full bg-white text-gray-900 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50">
                                Start Documentation
                            </button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}