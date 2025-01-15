// components/team/TeamTable.tsx
import Image from 'next/image';
import { MoreVertical } from 'lucide-react';
import { TeamMember, TeamMemberStatus } from '@/types/team';
import React from "react";

interface TeamTableProps {
    members: TeamMember[];
    onEditMember: (member: TeamMember) => void;
    onRemoveMember: (memberId: string) => void;
    isLoading?: boolean;
}

export const TeamTable: React.FC<TeamTableProps> = ({
                                                        members,
                                                        onEditMember,
                                                        onRemoveMember,
                                                        isLoading = false,
                                                    }) => {
    const getStatusColor = (status: TeamMemberStatus) => {
        switch (status) {
            case 'Active':
                return 'text-green-800 dark:text-green-200 bg-green-100 dark:bg-green-900';
            case 'Away':
                return 'text-yellow-800 dark:text-yellow-200 bg-yellow-100 dark:bg-yellow-900';
            case 'Offline':
                return 'text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-900';
            default:
                return 'text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-900';
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Member
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Department
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Status
                    </th>
                    <th className="relative px-6 py-3">
                        <span className="sr-only">Actions</span>
                    </th>
                </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {members.map((member) => (
                    <tr
                        key={member.id}
                        className={`${isLoading ? 'opacity-50' : ''} hover:bg-gray-50 dark:hover:bg-gray-700`}
                    >
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                                <Image
                                    className="h-10 w-10 rounded-full"
                                    src={member.avatar || '/api/placeholder/40/40'}
                                    alt={member.name}
                                    width={40}
                                    height={40}
                                />
                                <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                        {member.name}
                                    </div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                        {member.email}
                                    </div>
                                </div>
                            </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                                    text-blue-800 dark:text-blue-200 bg-blue-100 dark:bg-blue-900">
                                    {member.role}
                                </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {member.department}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                                    ${getStatusColor(member.status)}`}>
                                    {member.status}
                                </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="relative">
                                <button
                                    className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        const menu = e.currentTarget.nextElementSibling;
                                        if (menu) {
                                            menu.classList.toggle('hidden');
                                        }
                                    }}
                                    disabled={isLoading}
                                >
                                    <MoreVertical className="h-5 w-5" />
                                </button>
                                <div className="hidden absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 z-10">
                                    <div className="py-1" role="menu">
                                        <button
                                            className="w-full text-left block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                const menu = e.currentTarget.parentElement?.parentElement;
                                                if (menu) {
                                                    menu.classList.add('hidden');
                                                }
                                                onEditMember(member);
                                            }}
                                            disabled={isLoading}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="w-full text-left block px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-600"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                const menu = e.currentTarget.parentElement?.parentElement;
                                                if (menu) {
                                                    menu.classList.add('hidden');
                                                }
                                                onRemoveMember(member.id);
                                            }}
                                            disabled={isLoading}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};
