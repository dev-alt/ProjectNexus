// DashboardStats.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface StatsCard {
    title: string;
    value: string;
    description: string;
    icon: LucideIcon;
    trend: string;
    trendDirection?: 'up' | 'down';
}

interface DashboardStatsProps {
    cards: StatsCard[];
}

export const DashboardStats = ({ cards }: DashboardStatsProps) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {cards.map((card) => {
                const Icon = card.icon;
                const isPositiveTrend = !card.trend.startsWith('-');

                return (
                    <Card key={card.title} className="hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500">
                                {card.title}
                            </CardTitle>
                            <Icon className="h-4 w-4 text-gray-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{card.value}</div>
                            <p className="text-xs text-gray-600 mt-1">{card.description}</p>
                            <div className={`text-xs mt-2 flex items-center ${
                                isPositiveTrend ? 'text-green-600' : 'text-red-600'
                            }`}>
                                {card.trend}
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
};
