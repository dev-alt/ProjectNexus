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

// // app/(protected)/team/[id]/page.tsx
// 'use client';
//
// import { useState, useEffect } from 'react';
// import { TeamHeader } from '@/components/team/TeamHeader';
// import { TeamStats } from '@/components/team/TeamStats';
// import { TeamSearch } from '@/components/team/TeamSearch';
// import { TeamTable } from '@/components/team/TeamTable';
// import { TeamMemberForm } from '@/components/team/TeamMemberForm';
// import { useTeams } from '@/lib/hooks/use-teams';
// import { TeamMember, TeamMemberRole, TeamMemberStatus } from '@/types/team';
// import { useToast } from '@/lib/hooks/use-toast';
// import {teamApi} from "@/lib/api/team";
//
// interface TeamPageProps {
//     params: {
//         id: string;
//     };
// }
//
// export default function TeamPage({ params }: TeamPageProps) {
//     const [searchQuery, setSearchQuery] = useState('');
//     const [isAddingMember, setIsAddingMember] = useState(false);
//     const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
//     const { toast } = useToast();
//     const { teams, isLoading, refreshTeams: refreshTeam } = useTeams();
//
//     // Find the current team
//     const currentTeam = teams.find(team => team.id === params.id);
//     const members = currentTeam?.members || [];
//
//     useEffect(() => {
//         refreshTeam().then(r => r);
//     }, [refreshTeam]);
//
//     // Get unique departments and active members count
//     const departments = Array.from(new Set(members.map((member: TeamMember) => member.department)));
//     const activeMembers = members.filter((member: TeamMember) => member.status === 'Active' as TeamMemberStatus).length;
//
//     // Filter team members based on search query
//     const filteredMembers = members.filter((member: TeamMember) => {
//         const searchLower = searchQuery.toLowerCase();
//         return (
//             member.name.toLowerCase().includes(searchLower) ||
//             member.role.toLowerCase().includes(searchLower) ||
//             (member.department?.toLowerCase() || '').includes(searchLower) ||
//             member.email.toLowerCase().includes(searchLower)
//         );
//     });
//
//     // Handle adding new team member
//     const handleAddMember = async (data: { email?: string; role?: TeamMemberRole }) => {
//         if (!data.email) {
//             throw new Error('Email is required to add a new member');
//         }
//
//         if (!data.role) {
//             throw new Error('Role is required to add a new member');
//         }
//
//         try {
//             // Add member logic using team API
//             setIsAddingMember(false);
//             toast({
//                 title: 'Success',
//                 description: 'Team member added successfully',
//                 variant: 'success',
//             });
//         } catch (error) {
//             toast({
//                 title: 'Error',
//                 description: error instanceof Error ? error.message : 'Failed to add team member',
//                 variant: 'destructive',
//             });
//         }
//     };
//
//     // Handle updating team member
//     const handleUpdateMember = async (data: { role?: string; status?: string }) => {
//         if (!editingMember || !currentTeam) return;
//
//         try {
//             await teamApi.updateTeamMember(currentTeam.id, editingMember.id, data);
//             await refreshTeam();
//             setEditingMember(null);
//             toast({
//                 title: 'Success',
//                 description: 'Team member updated successfully',
//                 variant: 'success',
//             });
//         } catch (error) {
//             toast({
//                 title: 'Error',
//                 description: error instanceof Error ? error.message : 'Failed to update team member',
//                 variant: 'destructive',
//             });
//         }
//     };
//
//     // Handle removing team member
//     const handleRemoveMember = async (memberId: string) => {
//         if (!currentTeam) return;
//
//         if (window.confirm('Are you sure you want to remove this team member?')) {
//             try {
//                 await teamApi.removeTeamMember(currentTeam.id, memberId);
//                 await refreshTeam();
//                 toast({
//                     title: 'Success',
//                     description: 'Team member removed successfully',
//                     variant: 'success',
//                 });
//             } catch (error) {
//                 toast({
//                     title: 'Error',
//                     description: error instanceof Error ? error.message : 'Failed to remove team member',
//                     variant: 'destructive',
//                 });
//             }
//         }
//     };
//
//     if (isLoading && members.length === 0) {
//         return (
//             <div className="h-96 flex items-center justify-center">
//                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100" />
//             </div>
//         );
//     }
//
//     if (!currentTeam) {
//         return (
//             <div className="text-center py-12">
//                 <h3 className="text-lg font-semibold">Team not found</h3>
//                 <p className="text-gray-500 mt-2">The team you&#39;re looking for doesn&#39;t exist.</p>
//             </div>
//         );
//     }
//
//     return (
//         <div className="space-y-6">
//             <TeamHeader onAddMember={() => setIsAddingMember(true)} />
//
//             <TeamStats
//                 totalMembers={members.length}
//                 totalDepartments={departments.length}
//                 activeMembers={activeMembers}
//             />
//
//             <TeamSearch
//                 value={searchQuery}
//                 onChange={setSearchQuery}
//             />
//
//             {members.length === 0 ? (
//                 <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
//                     <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">No team members yet</h3>
//                     <p className="mt-2 text-gray-600 dark:text-gray-400">
//                         Get started by adding your first team member.
//                     </p>
//                     <button
//                         onClick={() => setIsAddingMember(true)}
//                         className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//                     >
//                         Add Team Member
//                     </button>
//                 </div>
//             ) : (
//                 <TeamTable
//                     members={filteredMembers}
//                     onEditMember={setEditingMember}
//                     onRemoveMember={handleRemoveMember}
//                     isLoading={isLoading}
//                 />
//             )}
//
//             {(isAddingMember || editingMember) && (
//                 <TeamMemberForm
//                     member={editingMember || undefined}
//                     onSubmit={editingMember ? handleUpdateMember : handleAddMember}
//                     onClose={() => {
//                         setIsAddingMember(false);
//                         setEditingMember(null);
//                     }}
//                     isLoading={isLoading}
//                 />
//             )}
//         </div>
//     );
// }
