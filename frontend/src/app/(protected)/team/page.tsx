// app/(protected)/team/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Users, Building, Activity } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import Button from '@/components/ui/Button';
import SearchInput from '@/components/ui/SearchInput';
import { useTeams } from '@/lib/hooks/use-teams';
import { CreateTeamForm } from '@/components/team/CreateTeamForm';

interface TeamCardProps {
    id: string;
    name: string;
    description: string;
    members: number;
    lead: string;
    updatedAt: string;
}

const TeamCard = ({ id, name, description, members, lead, updatedAt }: TeamCardProps) => (
    <Link href={`/team/${id}`}>
        <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                            <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">{name}</h3>
                            <p className="text-sm text-gray-500">{lead}</p>
                        </div>
                    </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{description}</p>
                <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">{members} members</span>
                    <span className="text-gray-500">Updated {new Date(updatedAt).toLocaleDateString()}</span>
                </div>
            </CardContent>
        </Card>
    </Link>
);

export default function TeamsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const { teams, isLoading, createTeam } = useTeams();

    // Stats data
    const stats = [
        {
            label: 'Total Teams',
            value: teams.length,
            icon: Users,
            colorClass: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400'
        },
        {
            label: 'Departments',
            value: '5',
            icon: Building,
            colorClass: 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400'
        },
        {
            label: 'Active Projects',
            value: '12',
            icon: Activity,
            colorClass: 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-400'
        }
    ];

    // Filter teams based on search
    const filteredTeams = teams.filter(team =>
        team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        team.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleCreateTeam = async (data: { name: string; description: string }) => {
        await createTeam(data);
        setIsCreating(false);
    };

    if (isLoading) {
        return (
            <div className="h-96 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header actions */}
            <div className="flex justify-between items-center">
                <div className="space-y-1">
                    <h2 className="text-2xl font-bold">Teams</h2>
                    <p className="text-gray-500">Manage and collaborate with different teams</p>
                </div>
                <Button
                    leftIcon={<Plus className="w-4 h-4" />}
                    onClick={() => setIsCreating(true)}
                >
                    Create New Team
                </Button>
            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                    <Card key={index}>
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-4">
                                <div className={`p-3 rounded-lg ${stat.colorClass}`}>
                                    <stat.icon className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-2xl font-semibold">{stat.value}</p>
                                    <p className="text-sm text-gray-500">{stat.label}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Search */}
            <div className="flex items-center space-x-4">
                <div className="flex-1">
                    <SearchInput
                        placeholder="Search teams..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Teams grid */}
            {filteredTeams.length === 0 ? (
                <div className="text-center py-12">
                    <h3 className="text-lg font-semibold">No teams found</h3>
                    <p className="text-gray-500 mt-2">Create a new team to get started</p>
                    <Button
                        className="mt-4"
                        leftIcon={<Plus className="w-4 h-4" />}
                        onClick={() => setIsCreating(true)}
                    >
                        Create New Team
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTeams.map((team) => (
                        <TeamCard
                            key={team.id}
                            id={team.id}
                            name={team.name}
                            description={team.description}
                            members={team.members.length}
                            lead={team.lead}
                            updatedAt={team.updatedAt}
                        />
                    ))}
                </div>
            )}

            {/* Create Team Modal */}
            {isCreating && (
                <CreateTeamForm
                    onSubmit={handleCreateTeam}
                    onClose={() => setIsCreating(false)}
                    isLoading={isLoading}
                />
            )}
        </div>
    );
}
