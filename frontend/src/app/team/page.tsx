// app/team/page.tsx
'use client';

import { useState } from 'react';
import { TeamHeader } from '@/components/team/TeamHeader';
import { TeamStats } from '@/components/team/TeamStats';
import { TeamSearch } from '@/components/team/TeamSearch';
import { TeamTable } from '@/components/team/TeamTable';
import { TeamMemberForm } from '@/components/team/TeamMemberForm';
import { TeamMember } from '@/types/team';

// Initial mock data
const initialTeam: TeamMember[] = [
    {
        id: 1,
        name: 'Alex Morrison',
        role: 'Lead Developer',
        email: 'alex@example.com',
        department: 'Engineering',
        projects: ['E-commerce Platform', 'API Integration'],
        avatar: '/api/placeholder/32/32',
        status: 'Active',
    },
    {
        id: 2,
        name: 'Sarah Chen',
        role: 'Senior Designer',
        email: 'sarah@example.com',
        department: 'Design',
        projects: ['Mobile App Redesign'],
        avatar: '/api/placeholder/32/32',
        status: 'Active',
    },
    {
        id: 3,
        name: 'Michael Scott',
        role: 'Project Manager',
        email: 'michael@example.com',
        department: 'Management',
        projects: ['E-commerce Platform', 'Mobile App Redesign'],
        avatar: '/api/placeholder/32/32',
        status: 'Away',
    },
];

export default function TeamPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [team, setTeam] = useState(initialTeam);
    const [isAddingMember, setIsAddingMember] = useState(false);
    const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Get unique departments and active members count
    const departments = Array.from(new Set(team.map(member => member.department)));
    const activeMembers = team.filter(member => member.status === 'Active').length;

    // Filter team members based on search query
    const filteredMembers = team.filter(
        (member) =>
            member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
            member.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
            member.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Handle adding new team member
    const handleAddMember = async (data: Partial<TeamMember>) => {
        setIsLoading(true);
        try {
            // In a real app, this would be an API call
            const newMember = {
                ...data,
                id: Math.max(...team.map(m => m.id)) + 1,
                projects: [],
                avatar: '/api/placeholder/32/32',
            } as TeamMember;

            setTeam([...team, newMember]);
            setIsAddingMember(false);
        } catch (error) {
            console.error('Failed to add team member:', error);
            // Handle error (show toast notification, etc.)
        } finally {
            setIsLoading(false);
        }
    };

    // Handle updating team member
    const handleUpdateMember = async (data: Partial<TeamMember>) => {
        if (!editingMember) return;

        setIsLoading(true);
        try {
            // In a real app, this would be an API call
            const updatedTeam = team.map(member =>
                member.id === editingMember.id
                    ? { ...member, ...data }
                    : member
            );

            setTeam(updatedTeam);
            setEditingMember(null);
        } catch (error) {
            console.error('Failed to update team member:', error);
            // Handle error (show toast notification, etc.)
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <TeamHeader onAddMember={() => setIsAddingMember(true)} />

            {/* Stats */}
            <TeamStats
                totalMembers={team.length}
                totalDepartments={departments.length}
                activeMembers={activeMembers}
            />

            {/* Search */}
            <TeamSearch
                value={searchQuery}
                onChange={setSearchQuery}
            />

            {/* Team Table */}
            <TeamTable
                members={filteredMembers}
                onEditMember={setEditingMember}
            />

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