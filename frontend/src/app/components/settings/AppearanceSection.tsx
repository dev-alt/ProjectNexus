// app/components/settings/AppearanceSection.tsx
import { Layout } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Select from '@/components/ui/Select';

interface AppearanceSectionProps {
    theme: string;
    language: string;
    onThemeChange: (theme: string) => void;
    onLanguageChange: (language: string) => void;
}

export const AppearanceSection = ({
                                      theme,
                                      onThemeChange,
                                      language,
                                      onLanguageChange
                                  }: AppearanceSectionProps) => {
    const themeOptions = [
        { value: 'light', label: 'Light' },
        { value: 'dark', label: 'Dark' },
        { value: 'system', label: 'System' }
    ];

    const languageOptions = [
        { value: 'en', label: 'English' },
        { value: 'es', label: 'Spanish' },
        { value: 'fr', label: 'French' }
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center">
                    <Layout className="h-5 w-5 mr-2" />
                    Appearance
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <Select
                        label="Theme"
                        value={theme}
                        onChange={(e) => onThemeChange(e.target.value)}
                        options={themeOptions}
                    />
                    <Select
                        label="Language"
                        value={language}
                        onChange={(e) => onLanguageChange(e.target.value)}
                        options={languageOptions}
                    />
                </div>
            </CardContent>
        </Card>
    );
};