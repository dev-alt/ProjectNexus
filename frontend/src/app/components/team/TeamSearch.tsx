// components/team/TeamSearch.tsx
import SearchInput from '@/components/ui/SearchInput';

interface TeamSearchProps {
    value: string;
    onChange: (value: string) => void;
}

export const TeamSearch: React.FC<TeamSearchProps> = ({ value, onChange }) => (
    <SearchInput
        placeholder="Search team members..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
    />
);

// components/team/TeamTable.tsx
import Image from 'next/image';
import { TeamMember } from '@/types/team';
import React from "react";

interface TeamTableProps {
    members: TeamMember[];
    onEditMember: (member: TeamMember) => void;
}

export const TeamTable: React.FC<TeamTableProps> = ({ members, onEditMember }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Member
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Role & Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Projects
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
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                    onClick={() => onEditMember(member)}
                >
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                            <Image
                                className="h-8 w-8 rounded-full"
                                src={member.avatar as string}
                                alt={`${member.name}'s avatar`}
                                width={32}
                                height={32}
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
                        <div className="text-sm text-gray-900 dark:text-gray-100">
                            {member.role}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            {member.department}
                        </div>
                    </td>
                    <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                            {member.projects?.map((project, index) => (
                                <span
                                    key={index}
                                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                                >
                                        {project}
                                    </span>
                            ))}
                        </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                            <span
                                className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                                    ${
                                    member.status === 'Active'
                                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                        : member.status === 'Away'
                                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                            : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                                }`}
                            >
                                {member.status}
                            </span>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    </div>
);
