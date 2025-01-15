// app/(protected)/team/layout.tsx
'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Users } from 'lucide-react';

interface TeamLayoutProps {
    children: React.ReactNode;
}

export default function TeamLayout({ children }: TeamLayoutProps) {
    const pathname = usePathname();
    const teamId = pathname.split('/')[2]; // Get the team ID from the URL

    return (
        <div className="space-y-6">
            {/* Breadcrumb navigation */}
            <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
                <Link
                    href="/dashboard"
                    className="hover:text-gray-700 dark:hover:text-gray-300"
                >
                    Dashboard
                </Link>
                <ChevronRight className="w-4 h-4" />
                <Link
                    href="/team"
                    className="hover:text-gray-700 dark:hover:text-gray-300"
                >
                    Teams
                </Link>
                {teamId && (
                    <>
                        <ChevronRight className="w-4 h-4" />
                        <span className="text-gray-900 dark:text-gray-100">
                            Team {teamId}
                        </span>
                    </>
                )}
            </nav>

            {/* Header */}
            <div className="flex items-center justify-between pb-6">
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                        <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-semibold">Team Management</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Manage your team members and roles
                        </p>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    );
}
