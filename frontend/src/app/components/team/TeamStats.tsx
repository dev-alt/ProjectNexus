// components/team/TeamStats.tsx
import { Card, CardContent } from '@/components/ui/card';
import { User, Building } from 'lucide-react';
import React from "react";

interface TeamStatsProps {
    totalMembers: number;
    totalDepartments: number;
    activeMembers: number;
}

export const TeamStats: React.FC<TeamStatsProps> = ({
                                                        totalMembers,
                                                        totalDepartments,
                                                        activeMembers,
                                                    }) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
            <CardContent className="flex items-center p-6">
                <User className="h-5 w-5 text-blue-600 mr-4" />
                <div>
                    <p className="text-2xl font-bold">{totalMembers}</p>
                    <p className="text-sm text-gray-500">Total Members</p>
                </div>
            </CardContent>
        </Card>
        <Card>
            <CardContent className="flex items-center p-6">
                <Building className="h-5 w-5 text-blue-600 mr-4" />
                <div>
                    <p className="text-2xl font-bold">{totalDepartments}</p>
                    <p className="text-sm text-gray-500">Departments</p>
                </div>
            </CardContent>
        </Card>
        <Card>
            <CardContent className="flex items-center p-6">
                <User className="h-5 w-5 text-blue-600 mr-4" />
                <div>
                    <p className="text-2xl font-bold">{activeMembers}</p>
                    <p className="text-sm text-gray-500">Active Now</p>
                </div>
            </CardContent>
        </Card>
    </div>
);