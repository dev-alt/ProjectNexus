// components/present/TeamGrid.tsx
import React from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { TeamMember }  from '@/types/present';

interface TeamGridProps {
    team: TeamMember[];
    onTeamMemberClick?: (member: TeamMember) => void;
}

export default function TeamGrid({ team, onTeamMemberClick }: TeamGridProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {team.map((member) => (
                <Card
                    key={member.id}
                    className="hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => onTeamMemberClick?.(member)}
                >
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-4">
                            <Image
                                src={member.avatar}
                                alt={`${member.name}'s avatar`}
                                width={48}
                                height={48}
                                className="h-12 w-12 rounded-full object-cover"
                            />
                            <div>
                                <h3 className="font-medium">{member.name}</h3>
                                <p className="text-sm text-gray-500">{member.role}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}