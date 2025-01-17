// app/settings/page.tsx
'use client';

import { useState } from 'react';
import { User, Bell, Palette, Globe, Shield, Monitor } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import Button from '@/components/ui/Button';
import { ProfileSection } from '@/components/settings/ProfileSection';
import { SecuritySection } from '@/components/settings/SecuritySection';
import { NotificationSection } from '@/components/settings/NotificationSection';
import { AppearanceSection } from '@/components/settings/AppearanceSection';

interface TabProps {
    icon: typeof User;
    label: string;
    isActive: boolean;
    onClick: () => void;
}

const SettingsTab = ({ icon: Icon, label, isActive, onClick }: TabProps) => (
    <button
        onClick={onClick}
        className={`flex items-center space-x-2 w-full p-3 rounded-lg transition-colors ${
            isActive
                ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
        }`}
    >
        <Icon className="h-5 w-5" />
        <span className="font-medium">{label}</span>
    </button>
);

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('profile');
    const [settings, setSettings] = useState({
        profile: {
            name: 'John Doe',
            email: 'john@example.com',
            avatar: '/api/placeholder/96/96'
        },
        notifications: {
            email: true,
            desktop: true,
            updates: false,
        },
        theme: 'light',
        language: 'en'
    });

    const tabs = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'security', label: 'Security', icon: Shield },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'appearance', label: 'Appearance', icon: Palette },
        { id: 'integrations', label: 'Integrations', icon: Monitor },
        { id: 'language', label: 'Language', icon: Globe },
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Settings</h1>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Manage your account settings and preferences
                    </p>
                </header>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar */}
                    <aside className="w-full lg:w-64 flex-shrink-0">
                        <nav className="space-y-1">
                            {tabs.map(tab => (
                                <SettingsTab
                                    key={tab.id}
                                    icon={tab.icon}
                                    label={tab.label}
                                    isActive={activeTab === tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                />
                            ))}
                        </nav>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1 space-y-6">
                        <Card className="overflow-hidden">
                            <CardContent className="p-6">
                                {activeTab === 'profile' && (
                                    <ProfileSection
                                        user={settings.profile}
                                        onSave={(profileData) => {
                                            setSettings(prev => ({
                                                ...prev,
                                                profile: profileData
                                            }));
                                        }}
                                    />
                                )}

                                {activeTab === 'security' && (
                                    <SecuritySection
                                        onPasswordUpdate={(passwordData) => {
                                            console.log('Password update:', passwordData);
                                        }}
                                    />
                                )}

                                {activeTab === 'notifications' && (
                                    <NotificationSection
                                        notifications={settings.notifications}
                                        onUpdate={(notificationSettings) => {
                                            setSettings(prev => ({
                                                ...prev,
                                                notifications: notificationSettings
                                            }));
                                        }}
                                    />
                                )}

                                {activeTab === 'appearance' && (
                                    <AppearanceSection
                                        theme={settings.theme}
                                        language={settings.language}
                                        onThemeChange={(theme) => {
                                            setSettings(prev => ({ ...prev, theme }));
                                        }}
                                        onLanguageChange={(language) => {
                                            setSettings(prev => ({ ...prev, language }));
                                        }}
                                    />
                                )}
                            </CardContent>
                        </Card>

                        <div className="flex justify-end">
                            <Button
                                onClick={() => console.log('Saving settings:', settings)}
                                className="w-full sm:w-auto"
                            >
                                Save Changes
                            </Button>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
