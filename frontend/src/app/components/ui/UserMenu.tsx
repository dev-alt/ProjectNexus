import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import { LogOut, Settings, UserCircle } from 'lucide-react';

type UserStatus = 'online' | 'away' | 'busy' | 'offline';

interface User {
    name?: string; // Made optional
    email?: string; // Made optional
}

interface UserMenuProps {
    user: User;
    userStatus: UserStatus;
    onStatusChange: (status: UserStatus) => void;
    onLogout: () => void;
}

const statusColors: Record<UserStatus, { bg: string; ring: string }> = {
    online: { bg: 'bg-green-500', ring: 'ring-green-300' },
    away: { bg: 'bg-yellow-500', ring: 'ring-yellow-300' },
    busy: { bg: 'bg-red-500', ring: 'ring-red-300' },
    offline: { bg: 'bg-gray-500', ring: 'ring-gray-300' }
};

const UserMenu = ({ user, userStatus, onStatusChange, onLogout }: UserMenuProps) => {
    const [showUserMenu, setShowUserMenu] = React.useState(false);
    const userMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setShowUserMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleStatusChange = (newStatus: UserStatus) => {
        onStatusChange(newStatus);
        setShowUserMenu(false);
    };

    // Get user initial safely
    const getUserInitial = () => {
        if (!user.name) return '?';
        return user.name.charAt(0).toUpperCase();
    };

    // Get display name safely
    const getDisplayName = () => {
        return user.name || 'User';
    };

    return (
        <div className="relative" ref={userMenuRef}>
            <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            >
                <div className="relative">
                    <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                            {getUserInitial()}
                        </span>
                    </div>
                    <div
                        className={`absolute bottom-0 right-0 h-3 w-3 rounded-full ring-2 ring-white dark:ring-gray-900 ${statusColors[userStatus].bg} ${statusColors[userStatus].ring}`}
                    />
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    {getDisplayName()}
                </span>
            </button>

            {showUserMenu && (
                <div className="absolute top-full right-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1">
                    <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {getDisplayName()}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            {user.email || 'No email provided'}
                        </p>
                    </div>

                    {/* Status Options */}
                    <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700">
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Set Status</p>
                        {Object.entries(statusColors).map(([status]) => (
                            <button
                                key={status}
                                onClick={() => handleStatusChange(status as UserStatus)}
                                className="flex items-center w-full px-2 py-1 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                            >
                                <span className={`h-2 w-2 rounded-full ${statusColors[status as UserStatus].bg} mr-2`} />
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                            </button>
                        ))}
                    </div>

                    <div className="py-1">
                        <Link
                            href="/profile"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            <UserCircle className="h-4 w-4 mr-2" />
                            View Profile
                        </Link>
                        <Link
                            href="/settings"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            <Settings className="h-4 w-4 mr-2" />
                            Settings
                        </Link>
                        <button
                            onClick={onLogout}
                            className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            <LogOut className="h-4 w-4 mr-2" />
                            Sign Out
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserMenu;