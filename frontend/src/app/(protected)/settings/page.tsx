// app/settings/page.tsx
'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import { ProfileSection } from '@/components/settings/ProfileSection';
import { SecuritySection } from '@/components/settings/SecuritySection';
import { NotificationSection } from '@/components/settings/NotificationSection';
import { AppearanceSection } from '@/components/settings/AppearanceSection';

interface ProfileData {
    name: string;
    email: string;
    avatar: string;
}

interface PasswordData {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

interface NotificationSettings {
    email: boolean;
    desktop: boolean;
    updates: boolean;
    [key: string]: boolean;
}

interface Settings {
    profile: ProfileData;
    notifications: NotificationSettings;
    theme: string;
    language: string;
}

export default function SettingsPage() {
    const [settings, setSettings] = useState<Settings>({
        profile: {
            name: 'John Doe',
            email: 'john@example.com',
            avatar: '/api/placeholder/64/64'
        },
        notifications: {
            email: true,
            desktop: true,
            updates: false,
        },
        theme: 'light',
        language: 'en'
    });

    const handleProfileUpdate = (profileData: ProfileData) => {
        setSettings(prev => ({
            ...prev,
            profile: profileData
        }));
        // In a real app, make API call here
    };

    const handlePasswordUpdate = async (passwordData: PasswordData) => {
        // In a real app, make API call here
        console.log('Updating password:', passwordData);
    };

    const handleNotificationUpdate = (notificationSettings: NotificationSettings) => {
        setSettings(prev => ({
            ...prev,
            notifications: notificationSettings
        }));
        // In a real app, make API call here
    };

    const handleThemeChange = (newTheme: string) => {
        setSettings(prev => ({
            ...prev,
            theme: newTheme
        }));
        // In a real app, make API call here
    };

    const handleLanguageChange = (newLanguage: string) => {
        setSettings(prev => ({
            ...prev,
            language: newLanguage
        }));
        // In a real app, make API call here
    };

    const handleSaveAll = () => {
        // In a real app, this would make an API call to save all settings
        console.log('Saving all settings:', settings);
    };
    
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold">Settings</h1>

            <ProfileSection
                user={settings.profile}
                onSave={handleProfileUpdate}
            />

            <SecuritySection
                onPasswordUpdate={handlePasswordUpdate}
            />

            <NotificationSection
                notifications={settings.notifications}
                onUpdate={handleNotificationUpdate}
            />

            <AppearanceSection
                theme={settings.theme}
                language={settings.language}
                onThemeChange={handleThemeChange}
                onLanguageChange={handleLanguageChange}
            />

            <div className="flex justify-end">
                <Button onClick={handleSaveAll}>
                    Save Changes
                </Button>
            </div>
        </div>
    );
}