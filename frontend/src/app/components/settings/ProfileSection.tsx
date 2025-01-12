// app/components/settings/ProfileSection.tsx
import { useState } from "react";
import Image from "next/image";
import { User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

interface ProfileSectionProps {
    user: {
        name?: string;
        email?: string;
        avatar?: string;
    };
    onSave: (data: { name: string; email: string; avatar: string }) => void;
}

export const ProfileSection = ({ user, onSave }: ProfileSectionProps) => {
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        avatar: user?.avatar || '/api/placeholder/64/64'
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = () => {
        onSave(formData);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Profile Settings
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                    <Image
                        src={formData.avatar}
                        alt="Profile"
                        width={64}
                        height={64}
                        className="h-16 w-16 rounded-full"
                    />
                    <Button
                        variant="secondary"
                        onClick={handleSubmit}
                    >
                        Change Avatar
                    </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Full Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                    />
                    <Input
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                    />
                </div>
                <div className="flex justify-end">
                    <Button onClick={handleSubmit}>
                        Save Changes
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};