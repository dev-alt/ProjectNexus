// app/components/settings/NotificationToggle.tsx
import { LucideIcon } from 'lucide-react';

interface NotificationToggleProps {
    icon: LucideIcon;
    title: string;
    description: string;
    checked: boolean;
    onChange: () => void;
}

const NotificationToggle = ({
                                icon: Icon,
                                title,
                                description,
                                checked,
                                onChange
                            }: NotificationToggleProps) => (
    <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
            <Icon className="h-5 w-5 text-gray-500" />
            <div>
                <p className="font-medium">{title}</p>
                <p className="text-sm text-gray-500">{description}</p>
            </div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
            <input
                type="checkbox"
                checked={checked}
                onChange={onChange}
                className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
    </div>
);

export default NotificationToggle;