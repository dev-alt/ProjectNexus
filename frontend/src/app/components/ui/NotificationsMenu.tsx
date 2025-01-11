import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import { Bell } from 'lucide-react';

interface Notification {
    id: number;
    text: string;
    time: string;
}

interface NotificationsMenuProps {
    notifications: Notification[];
    notificationCount: number;
}

const NotificationsMenu = ({ notifications, notificationCount }: NotificationsMenuProps) => {
    const [showNotifications, setShowNotifications] = React.useState(false);
    const notificationsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
                setShowNotifications(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={notificationsRef}>
            <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg relative"
            >
                <Bell className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                {notificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 flex items-center justify-center">
            <span className="text-xs text-white font-medium">{notificationCount}</span>
          </span>
                )}
            </button>

            {showNotifications && (
                <div className="absolute top-full right-0 mt-1 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="font-medium text-gray-900 dark:text-gray-100">Notifications</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                        {notifications.map((notification) => (
                            <div
                                key={notification.id}
                                className="p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                            >
                                <p className="text-sm text-gray-800 dark:text-gray-200">{notification.text}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notification.time}</p>
                            </div>
                        ))}
                    </div>
                    <div className="p-4 text-center border-t border-gray-200 dark:border-gray-700">
                        <Link
                            href="/notifications"
                            className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                            View all notifications
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationsMenu;