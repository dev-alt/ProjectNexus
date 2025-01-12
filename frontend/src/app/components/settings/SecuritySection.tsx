// app/components/settings/SecuritySection.tsx
import { useState } from 'react';
import { Lock } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface SecuritySectionProps {
    onPasswordUpdate: (data: {
        currentPassword: string;
        newPassword: string;
        confirmPassword: string;
    }) => void;
}

export const SecuritySection = ({ onPasswordUpdate }: SecuritySectionProps) => {
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
        setError('');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.newPassword !== formData.confirmPassword) {
            setError('New passwords do not match');
            return;
        }
        onPasswordUpdate(formData);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center">
                    <Lock className="h-5 w-5 mr-2" />
                    Security
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        type="password"
                        label="Current Password"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        type="password"
                        label="New Password"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        type="password"
                        label="Confirm New Password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        error={error}
                        required
                    />
                    <div className="pt-2">
                        <Button type="submit">
                            Update Password
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};