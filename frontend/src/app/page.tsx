import React from 'react';
import { FileText, Users, Clock, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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

export default function Home() {
  return (
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-semibold text-gray-900">Welcome to ProjectNexus</h1>
          <p className="mt-2 text-gray-600">
            Your central hub for project planning and documentation. Start by creating a new project or continue working on existing ones.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((card) => {
            const Icon = card.icon;
            return (
                <Card key={card.title}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">
                      {card.title}
                    </CardTitle>
                    <Icon className="w-4 h-4 text-gray-500" />
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
              {[
                {
                  action: "Documentation updated",
                  project: "E-commerce Platform",
                  time: "2 hours ago",
                  user: "Alex Morrison"
                },
                {
                  action: "New project created",
                  project: "Mobile App Redesign",
                  time: "5 hours ago",
                  user: "Sarah Chen"
                },
                {
                  action: "Team member added",
                  project: "API Integration",
                  time: "1 day ago",
                  user: "Michael Scott"
                }
              ].map((activity, i) => (
                  <div key={i} className="flex items-center justify-between py-3">
                    <div className="flex-1">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Create New Project
              </button>
              <button className="w-full bg-gray-100 text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-200">
                Browse Documents
              </button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Getting Started</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
                  Create your first project
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
                  Set up your team members
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
                  Start documenting your plans
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
                  Explore AI-powered suggestions
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
  );
}