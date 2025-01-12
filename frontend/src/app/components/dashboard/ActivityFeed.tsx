// src/components/dashboard/ActivityFeed.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Activity {
    id: number;
    action: string;
    project: string;
    time: string;
    user: string;
    type?: 'document' | 'project' | 'team';
}

interface ActivityFeedProps {
    activities: Activity[];
    title?: string;
}

export const ActivityFeed = ({ activities, title = "Recent Activity" }: ActivityFeedProps) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {activities.map((activity) => (
                        <div key={activity.id}
                             className="flex items-center justify-between py-3 hover:bg-gray-50 rounded-lg px-3 transition-colors">
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
    );
};