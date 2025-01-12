import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, FileText, Target,
} from 'lucide-react';
import {
    LineChart, Line, AreaChart, Area,
    XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer
} from 'recharts';

interface ProjectMetric {
    category: string;
    value: number | string;
    trend: string;
    trendValue: number;
    icon: React.ElementType;
    chartData?: Array<{ date: string; value: number }>;
}

interface ProjectMetricsProps {
    metrics: ProjectMetric[];
}

const progressData = [
    { date: 'Jan', value: 20 },
    { date: 'Feb', value: 35 },
    { date: 'Mar', value: 45 },
    { date: 'Apr', value: 65 },
    { date: 'May', value: 75 },
];

export default function ProjectMetrics({ metrics }: ProjectMetricsProps) {
    const getTrendColor = (trend: number) => {
        if (trend > 0) return 'text-green-500';
        if (trend < 0) return 'text-red-500';
        return 'text-gray-500';
    };

    return (
        <div className="grid grid-cols-4 gap-4">
            {/* Top Level Metrics */}
            {metrics.map((metric, index) => {
                const Icon = metric.icon;
                return (
                    <Card key={index} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <Icon className="h-5 w-5 text-gray-500" />
                                <span className={`text-xs ${getTrendColor(metric.trendValue)}`}>
                  {metric.trend}
                </span>
                            </div>
                            <div className="mt-3">
                                <p className="text-2xl font-bold">{metric.value}</p>
                                <p className="text-sm text-gray-500">{metric.category}</p>
                            </div>
                            {metric.chartData && (
                                <div className="h-10 mt-2">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={metric.chartData}>
                                            <Line
                                                type="monotone"
                                                dataKey="value"
                                                stroke="#4F46E5"
                                                strokeWidth={2}
                                                dot={false}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                );
            })}

            {/* Progress Chart */}
            <Card className="col-span-2">
                <CardHeader>
                    <CardTitle className="text-sm font-medium">Progress Trend</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={progressData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#4F46E5"
                                    fill="#4F46E5"
                                    fillOpacity={0.1}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Team Activity */}
            <Card className="col-span-2">
                <CardHeader>
                    <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {/* Add activity items here */}
                        <div className="flex items-center text-sm">
                            <Users className="h-4 w-4 mr-2 text-blue-500" />
                            <span>New team member added</span>
                            <span className="ml-auto text-xs text-gray-500">2h ago</span>
                        </div>
                        <div className="flex items-center text-sm">
                            <FileText className="h-4 w-4 mr-2 text-green-500" />
                            <span>Documentation updated</span>
                            <span className="ml-auto text-xs text-gray-500">5h ago</span>
                        </div>
                        <div className="flex items-center text-sm">
                            <Target className="h-4 w-4 mr-2 text-purple-500" />
                            <span>Milestone completed</span>
                            <span className="ml-auto text-xs text-gray-500">1d ago</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
