// app/(protected)/team/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { TeamHeader } from '@/components/team/TeamHeader';
import { TeamStats } from '@/components/team/TeamStats';
import { TeamSearch } from '@/components/team/TeamSearch';
import { TeamTable } from '@/components/team/TeamTable';
import { TeamMemberForm } from '@/components/team/TeamMemberForm';
import { useTeams } from '@/lib/hooks/use-teams';
import { TeamMember, TeamMemberRole, TeamMemberStatus } from '@/types/team';
import { useToast } from '@/lib/hooks/use-toast';
import {teamApi} from "@/lib/api/team";

interface TeamPageProps {
    params: {
        id: string;
    };
}

export default function TeamPage({ params }: TeamPageProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [isAddingMember, setIsAddingMember] = useState(false);
    const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
    const { toast } = useToast();
    const { teams, isLoading, refreshTeams: refreshTeam } = useTeams();

    // Find the current team
    const currentTeam = teams.find(team => team.id === params.id);
    const members = currentTeam?.members || [];

    useEffect(() => {
        refreshTeam().then(r => r);
    }, [refreshTeam]);

    // Get unique departments and active members count
    const departments = Array.from(new Set(members.map((member: TeamMember) => member.department)));
    const activeMembers = members.filter((member: TeamMember) => member.status === 'Active' as TeamMemberStatus).length;

    // Filter team members based on search query
    const filteredMembers = members.filter((member: TeamMember) => {
        const searchLower = searchQuery.toLowerCase();
        return (
            member.name.toLowerCase().includes(searchLower) ||
            member.role.toLowerCase().includes(searchLower) ||
            (member.department?.toLowerCase() || '').includes(searchLower) ||
            member.email.toLowerCase().includes(searchLower)
        );
    });

    // Handle adding new team member
    const handleAddMember = async (data: { email?: string; role?: TeamMemberRole }) => {
        if (!data.email) {
            throw new Error('Email is required to add a new member');
        }

        if (!data.role) {
            throw new Error('Role is required to add a new member');
        }

        try {
            // Add member logic using team API
            setIsAddingMember(false);
            toast({
                title: 'Success',
                description: 'Team member added successfully',
                variant: 'success',
            });
        } catch (error) {
            toast({
                title: 'Error',
                description: error instanceof Error ? error.message : 'Failed to add team member',
                variant: 'destructive',
            });
        }
    };

    // Handle updating team member
    const handleUpdateMember = async (data: { role?: string; status?: string }) => {
        if (!editingMember || !currentTeam) return;

        try {
            await teamApi.updateTeamMember(currentTeam.id, editingMember.id, data);
            await refreshTeam();
            setEditingMember(null);
            toast({
                title: 'Success',
                description: 'Team member updated successfully',
                variant: 'success',
            });
        } catch (error) {
            toast({
                title: 'Error',
                description: error instanceof Error ? error.message : 'Failed to update team member',
                variant: 'destructive',
            });
        }
    };

    // Handle removing team member
    const handleRemoveMember = async (memberId: string) => {
        if (!currentTeam) return;

        if (window.confirm('Are you sure you want to remove this team member?')) {
            try {
                await teamApi.removeTeamMember(currentTeam.id, memberId);
                await refreshTeam();
                toast({
                    title: 'Success',
                    description: 'Team member removed successfully',
                    variant: 'success',
                });
            } catch (error) {
                toast({
                    title: 'Error',
                    description: error instanceof Error ? error.message : 'Failed to remove team member',
                    variant: 'destructive',
                });
            }
        }
    };

    if (isLoading && members.length === 0) {
        return (
            <div className="h-96 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100" />
            </div>
        );
    }

    if (!currentTeam) {
        return (
            <div className="text-center py-12">
                <h3 className="text-lg font-semibold">Team not found</h3>
                <p className="text-gray-500 mt-2">The team you&#39;re looking for doesn&#39;t exist.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <TeamHeader onAddMember={() => setIsAddingMember(true)} />

            <TeamStats
                totalMembers={members.length}
                totalDepartments={departments.length}
                activeMembers={activeMembers}
            />

            <TeamSearch
                value={searchQuery}
                onChange={setSearchQuery}
            />

            {members.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">No team members yet</h3>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        Get started by adding your first team member.
                    </p>
                    <button
                        onClick={() => setIsAddingMember(true)}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Add Team Member
                    </button>
                </div>
            ) : (
                <TeamTable
                    members={filteredMembers}
                    onEditMember={setEditingMember}
                    onRemoveMember={handleRemoveMember}
                    isLoading={isLoading}
                />
            )}

            {(isAddingMember || editingMember) && (
                <TeamMemberForm
                    member={editingMember || undefined}
                    onSubmit={editingMember ? handleUpdateMember : handleAddMember}
                    onClose={() => {
                        setIsAddingMember(false);
                        setEditingMember(null);
                    }}
                    isLoading={isLoading}
                />
            )}
        </div>
    );
}
