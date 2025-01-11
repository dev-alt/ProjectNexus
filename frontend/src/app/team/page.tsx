'use client';

import { useState } from 'react';
import Image from 'next/image'; // Import next/image
import { Card, CardContent } from '@/components/ui/card';
import { Search, Plus, User, Building } from 'lucide-react';

// Team member data
const team = [
    {
        id: 1,
        name: 'Alex Morrison',
        role: 'Lead Developer',
        email: 'alex@example.com',
        department: 'Engineering',
        projects: ['E-commerce Platform', 'API Integration'],
        avatar: '/api/placeholder/32/32', // Placeholder image path
        status: 'Active',
    },
    {
        id: 2,
        name: 'Sarah Chen',
        role: 'Senior Designer',
        email: 'sarah@example.com',
        department: 'Design',
        projects: ['Mobile App Redesign'],
        avatar: '/api/placeholder/32/32', // Placeholder image path
        status: 'Active',
    },
    {
        id: 3,
        name: 'Michael Scott',
        role: 'Project Manager',
        email: 'michael@example.com',
        department: 'Management',
        projects: ['E-commerce Platform', 'Mobile App Redesign'],
        avatar: '/api/placeholder/32/32', // Placeholder image path
        status: 'Away',
    },
];

export default function TeamPage() {
    const [searchQuery, setSearchQuery] = useState('');

    // Filter team members based on search query
    const filteredMembers = team.filter(
        (member) =>
            member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
            member.department.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold">Team Members</h1>
                <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Member
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="flex items-center p-6">
                        <User className="h-5 w-5 text-blue-600 mr-4" />
                        <div>
                            <p className="text-2xl font-bold">24</p>
                            <p className="text-sm text-gray-500">Total Members</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="flex items-center p-6">
                        <Building className="h-5 w-5 text-blue-600 mr-4" />
                        <div>
                            <p className="text-2xl font-bold">6</p>
                            <p className="text-sm text-gray-500">Departments</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="flex items-center p-6">
                        <User className="h-5 w-5 text-blue-600 mr-4" />
                        <div>
                            <p className="text-2xl font-bold">18</p>
                            <p className="text-sm text-gray-500">Active Now</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search team members..."
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Team Members List */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Member
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Role & Department
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Projects
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                        </th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {filteredMembers.map((member) => (
                        <tr key={member.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    {/* Use next/image for optimized image loading */}
                                    <Image
                                        className="h-8 w-8 rounded-full"
                                        src={member.avatar}
                                        alt={`${member.name}'s avatar`} // Add alt text for accessibility
                                        width={32} // Specify width
                                        height={32} // Specify height
                                    />
                                    <div className="ml-4">
                                        <div className="text-sm font-medium text-gray-900">{member.name}</div>
                                        <div className="text-sm text-gray-500">{member.email}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{member.role}</div>
                                <div className="text-sm text-gray-500">{member.department}</div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex flex-wrap gap-1">
                                    {member.projects.map((project, index) => (
                                        <span
                                            key={index}
                                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
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
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
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
        </div>
    );
}