// app/components/settings/NotificationSection.tsx
import { Bell, Mail, Smartphone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import NotificationToggle from './NotificationToggle';


interface NotificationSettings {
    email: boolean;
    desktop: boolean;
    updates: boolean;
    [key: string]: boolean;
}


interface NotificationSectionProps {
    notifications: NotificationSettings;
    onUpdate: (notifications: NotificationSettings) => void;
}

export const NotificationSection = ({ notifications, onUpdate }: NotificationSectionProps) => {
    const handleToggle = (key: string) => {
        onUpdate({
            ...notifications,
            [key]: !notifications[key]
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center">
                    <Bell className="h-5 w-5 mr-2" />
                    Notifications
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <NotificationToggle
                        icon={Mail}
                        title="Email Notifications"
                        description="Receive email updates about your activity"
                        checked={notifications.email}
                        onChange={() => handleToggle('email')}
                    />
                    <NotificationToggle
                        icon={Smartphone}
                        title="Desktop Notifications"
                        description="Receive desktop notifications"
                        checked={notifications.desktop}
                        onChange={() => handleToggle('desktop')}
                    />
                </div>
            </CardContent>
        </Card>
    );
};