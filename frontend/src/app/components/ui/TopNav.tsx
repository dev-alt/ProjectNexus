import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/context/auth';
import SearchBar from '@/components/ui/SearchBar';
import NotificationsMenu from '@/components/ui/NotificationsMenu';
import UserMenu from '@/components/ui/UserMenu';
import ThemeToggle from '@/components/ui/ThemeToggle';

type UserStatus = 'online' | 'away' | 'busy' | 'offline';

const TopNav = () => {
    const { user, loading, logout } = useAuth();
    const [isDark, setIsDark] = useState(false);
    const [userStatus, setUserStatus] = useState<UserStatus>('online');
    const [notificationCount] = useState(3);

    // Mock notifications - in a real app, these would come from an API
    const notifications = [
        { id: 1, text: 'New comment on project "E-commerce Platform"', time: '2 min ago' },
        { id: 2, text: 'Sarah Chen shared a document with you', time: '1 hour ago' },
        { id: 3, text: 'Team meeting starting in 15 minutes', time: '4 hours ago' },
    ];

    // Initialize theme
    useEffect(() => {
        const savedTheme = localStorage.getItem('projectnexus-theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
            setIsDark(true);
            document.documentElement.classList.add('dark');
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = !isDark;
        setIsDark(newTheme);
        localStorage.setItem('projectnexus-theme', newTheme ? 'dark' : 'light');

        if (newTheme) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    const handleSearch = (query: string) => {
        // Implement search functionality
        console.log('Searching for:', query);
    };

    return (
        <nav className="fixed top-0 right-0 left-64 h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 z-10">
            <div className="h-full px-4 flex justify-between items-center">
                {/* Search Bar */}
                <SearchBar onSearch={handleSearch} />

                {/* Right Side Actions */}
                <div className="flex items-center space-x-4">
                    <ThemeToggle isDark={isDark} onToggle={toggleTheme} />

                    <NotificationsMenu
                        notifications={notifications}
                        notificationCount={notificationCount}
                    />

                    {loading ? (
                        <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
                    ) : user ? (
                        <UserMenu
                            user={user}
                            userStatus={userStatus}
                            onStatusChange={setUserStatus}
                            onLogout={logout}
                        />
                    ) : (
                        <div className="flex items-center space-x-2">
                            <Link
                                href="/login"
                                className="px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-sm font-medium"
                            >
                                Sign In
                            </Link>
                            <Link
                                href="/register"
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                            >
                                Sign Up
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default TopNav;