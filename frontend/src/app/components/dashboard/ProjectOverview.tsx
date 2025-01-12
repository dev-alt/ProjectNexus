// src/components/dashboard/ProjectOverview.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ProjectSummary {
    label: string;
    value: string;
    trendValue?: string;
    trendLabel?: string;
}

interface ProjectOverviewProps {
    summaries: ProjectSummary[];
}

export const ProjectOverview = ({ summaries }: ProjectOverviewProps) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Project Overview</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {summaries.map((summary, index) => (
                        <div key={index} className="flex justify-between items-center">
                            <div>
                                <span className="text-sm font-medium">{summary.label}</span>
                                {summary.trendLabel && (
                                    <span className="text-xs text-gray-500 ml-2">
                    {summary.trendLabel}
                  </span>
                                )}
                            </div>
                            <div className="text-right">
                                <span className="text-sm text-gray-500">{summary.value}</span>
                                {summary.trendValue && (
                                    <span className="text-xs text-green-600 ml-2">
                    {summary.trendValue}
                  </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};
