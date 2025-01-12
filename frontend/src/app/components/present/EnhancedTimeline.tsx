import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    CheckCircle, Clock, AlertCircle,
    ChevronRight, User, Calendar,
    MessageSquare
} from 'lucide-react';
import { TimelineEvent } from '@/types/present';

interface EnhancedTimelineProps {
    events: TimelineEvent[];
    onEventClick?: (event: TimelineEvent) => void;
}

export default function EnhancedTimeline({ events, onEventClick }: EnhancedTimelineProps) {
    const [expandedEventId, setExpandedEventId] = useState<number | null>(null);

    const getStatusIcon = (status: TimelineEvent['status']) => {
        switch (status) {
            case 'completed':
                return <CheckCircle className="h-4 w-4 text-green-500" />;
            case 'current':
                return <Clock className="h-4 w-4 text-blue-500" />;
            case 'upcoming':
                return <AlertCircle className="h-4 w-4 text-gray-400" />;
        }
    };

    const getStatusStyles = (status: TimelineEvent['status']) => {
        switch (status) {
            case 'completed':
                return 'border-green-200 hover:bg-green-50';
            case 'current':
                return 'border-blue-200 hover:bg-blue-50';
            case 'upcoming':
                return 'border-gray-200 hover:bg-gray-50';
        }
    };

    return (
        <Card className="h-full">
            <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                    <CardTitle className="text-sm font-medium">Project Timeline</CardTitle>
                    <div className="flex space-x-4 text-xs text-gray-500">
            <span className="flex items-center">
              <span className="h-2 w-2 bg-green-500 rounded-full mr-1"></span>
              Done
            </span>
                        <span className="flex items-center">
              <span className="h-2 w-2 bg-blue-500 rounded-full mr-1"></span>
              Current
            </span>
                        <span className="flex items-center">
              <span className="h-2 w-2 bg-gray-400 rounded-full mr-1"></span>
              Upcoming
            </span>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="relative">
                    {/* Vertical line */}
                    <div className="absolute left-2 top-0 h-full w-px bg-gray-200" />

                    {/* Timeline events */}
                    <div className="space-y-3">
                        {events.map((event) => (
                            <div key={event.id} className="relative">
                                <div
                                    className={`relative flex items-start pl-6 py-2 border rounded-lg cursor-pointer transition-colors ${getStatusStyles(
                                        event.status
                                    )}`}
                                    onClick={() => {
                                        setExpandedEventId(expandedEventId === event.id ? null : event.id);
                                        onEventClick?.(event);
                                    }}
                                >
                                    {/* Event dot */}
                                    <div className="absolute left-2 top-3 -translate-x-1/2 bg-white">
                                        {getStatusIcon(event.status)}
                                    </div>

                                    {/* Event content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                {event.title}
                                            </p>
                                            <ChevronRight
                                                className={`h-4 w-4 text-gray-400 transform transition-transform ${
                                                    expandedEventId === event.id ? 'rotate-90' : ''
                                                }`}
                                            />
                                        </div>
                                        <div className="flex items-center space-x-4 mt-1">
                      <span className="flex items-center text-xs text-gray-500">
                        <Calendar className="h-3 w-3 mr-1" />
                          {new Date(event.date).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                          })}
                      </span>
                                            {event.assignee && (
                                                <span className="flex items-center text-xs text-gray-500">
                          <User className="h-3 w-3 mr-1" />
                                                    {event.assignee}
                        </span>
                                            )}
                                            {event.comments && (
                                                <span className="flex items-center text-xs text-gray-500">
                          <MessageSquare className="h-3 w-3 mr-1" />
                                                    {event.comments}
                        </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Expanded content */}
                                {expandedEventId === event.id && event.subEvents && (
                                    <div className="ml-6 mt-2 pl-6 border-l border-dashed border-gray-200">
                                        {event.subEvents.map((subEvent) => (
                                            <div
                                                key={subEvent.id}
                                                className="flex items-center py-1"
                                            >
                                                <div className="w-4 h-4 flex items-center justify-center">
                                                    {subEvent.status === 'completed' ? (
                                                        <CheckCircle className="h-3 w-3 text-green-500" />
                                                    ) : (
                                                        <Clock className="h-3 w-3 text-gray-400" />
                                                    )}
                                                </div>
                                                <span className="ml-2 text-xs text-gray-600">
                          {subEvent.title}
                        </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
