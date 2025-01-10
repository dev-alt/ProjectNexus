"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FileText, Home, Settings, Users, Layout, LogOut } from 'lucide-react';

const MainNav = () => {
    const pathname = usePathname();

    const navItems = [
        { href: '/', label: 'Home', icon: Home },
        { href: '/projects', label: 'Projects', icon: Layout },
        { href: '/documents', label: 'Documents', icon: FileText },
        { href: '/mockups', label: 'Mockups', icon: FileText },
        { href: '/ProjectPresentation', label: 'Project Presentation', icon: FileText },
        { href: '/team', label: 'Team', icon: Users },
        { href: '/settings', label: 'Settings', icon: Settings },
    ];

    return (
        <nav className="h-screen w-64 bg-gray-900 text-gray-100 fixed left-0 top-0">
            <div className="p-4">
                <h1 className="text-xl font-bold">ProjectNexus</h1>
            </div>

            <div className="mt-8">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center px-4 py-3 text-sm ${
                                isActive
                                    ? 'bg-gray-800 text-white'
                                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                            }`}
                        >
                            <Icon className="w-5 h-5 mr-3" />
                            {item.label}
                        </Link>
                    );
                })}
            </div>

            <div className="absolute bottom-0 w-full p-4">
                <button className="flex items-center px-4 py-3 text-sm text-gray-400 hover:bg-gray-800 hover:text-white w-full">
                    <LogOut className="w-5 h-5 mr-3" />
                    Sign Out
                </button>
            </div>
        </nav>
    );
};

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-gray-50">
            <MainNav />
            <main className="pl-64">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    {children}
                </div>
            </main>
        </div>
    );
}