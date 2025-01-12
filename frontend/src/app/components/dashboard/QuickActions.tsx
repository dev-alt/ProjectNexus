// src/components/dashboard/QuickActions.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Button from '@/components/ui/Button';
import { LucideIcon } from 'lucide-react';

interface QuickAction {
    label: string;
    icon: LucideIcon;
    onClick: () => void;
    variant?: 'primary' | 'secondary';
}

interface QuickActionsProps {
    actions: QuickAction[];
}

export const QuickActions = ({ actions }: QuickActionsProps) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {actions.map((action, index) => {
                        const Icon = action.icon;
                        return (
                            <Button
                                key={index}
                                variant={action.variant || 'secondary'}
                                fullWidth
                                onClick={action.onClick}
                                leftIcon={<Icon className="h-4 w-4" />}
                            >
                                {action.label}
                            </Button>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
};
