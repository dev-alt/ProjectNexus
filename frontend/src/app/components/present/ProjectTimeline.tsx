import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface TimelineEvent {
    id: number;
    title: string;
    date: string;
    status: 'completed' | 'current' | 'upcoming';
    description: string;
    category: string;
}

interface ProjectTimelineProps {
    events: TimelineEvent[];
}

export default function ProjectTimeline({ events }: ProjectTimelineProps) {
    const getStatusIcon = (status: TimelineEvent['status']) => {
        switch (status) {
            case 'completed':
                return <CheckCircle className="h-6 w-6 text-green-500" />;
            case 'current':
                return <Clock className="h-6 w-6 text-blue-500" />;
            case 'upcoming':
                return <AlertCircle className="h-6 w-6 text-gray-400" />;
        }
    };

    const getStatusStyles = (status: TimelineEvent['status']) => {
        switch (status) {
            case 'completed':
                return 'bg-green-50 border-green-200';
            case 'current':
                return 'bg-blue-50 border-blue-200';
            case 'upcoming':
                return 'bg-gray-50 border-gray-200';
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                    <Clock className="h-5 w-5" />
                    <span>Project Timeline</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="relative">
                    {/* Vertical line */}
                    <div className="absolute left-8 top-0 bottom-0 w-px bg-gray-200" />

                    {/* Timeline events */}
                    <div className="space-y-6">
                        {events.map((event) => (
                            <div
                                key={event.id}
                                className={`relative flex items-start pl-16 py-4 rounded-lg border ${getStatusStyles(
                                    event.status
                                )}`}
                            >
                                {/* Event icon */}
                                <div className="absolute left-6 -translate-x-1/2 bg-white p-1 rounded-full">
                                    {getStatusIcon(event.status)}
                                </div>

                                {/* Event content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-base font-semibold text-gray-900">
                                            {event.title}
                                        </h3>
                                        <span className="text-sm text-gray-500">
                      {new Date(event.date).toLocaleDateString()}
                    </span>
                                    </div>
                                    <p className="mt-1 text-sm text-gray-600">{event.description}</p>
                                    <div className="mt-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {event.category}
                    </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}