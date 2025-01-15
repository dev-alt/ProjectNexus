// app/(protected)/projects/[id]/team/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { TeamHeader } from '@/components/team/TeamHeader';
import { TeamStats } from '@/components/team/TeamStats';
import { TeamSearch } from '@/components/team/TeamSearch';
import { TeamTable } from '@/components/team/TeamTable';
import {TeamMemberForm} from '@/components/team/TeamMemberForm';
import { useTeam } from '@/lib/hooks/use-team';
import {TeamMember, TeamMemberRole, TeamMemberStatus} from '@/types/team';
import { useToast } from '@/lib/hooks/use-toast';

export default function TeamPage({ params }: { params: { id: string } }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [isAddingMember, setIsAddingMember] = useState(false);
    const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
    const { toast } = useToast();

    const {
        members,
        isLoading,
        refreshTeam,
        addMember,
        updateMember,
        removeMember
    } = useTeam(params.id);

    useEffect(() => {
        refreshTeam().then(r => r);
    }, [refreshTeam]);

    // Get unique departments and active members count
    const departments = Array.from(new Set(members.map(member => member.department)));
    const activeMembers = members.filter(member => member.status === 'active' as TeamMemberStatus).length;

    // Filter team members based on search query
    const filteredMembers = members.filter((member) => {
        const searchLower = searchQuery.toLowerCase();
        return (
            member.name?.toLowerCase().includes(searchLower) ||
            member.role?.toLowerCase().includes(searchLower) ||
            member.department?.toLowerCase().includes(searchLower) ||
            member.email?.toLowerCase().includes(searchLower)
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
            await addMember(data.email, data.role);
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
        if (!editingMember) return;

        try {
            await updateMember(editingMember.id, data);
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
        if (window.confirm('Are you sure you want to remove this team member?')) {
            try {
                await removeMember(memberId);
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
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <TeamHeader onAddMember={() => setIsAddingMember(true)} />

            {/* Stats */}
            <TeamStats
                totalMembers={members.length}
                totalDepartments={departments.length}
                activeMembers={activeMembers}
            />

            {/* Search */}
            <TeamSearch
                value={searchQuery}
                onChange={setSearchQuery}
            />

            {/* Team Table */}
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

            {/* Add/Edit Member Modal */}
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
