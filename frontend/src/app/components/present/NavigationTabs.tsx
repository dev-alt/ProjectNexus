// components/present/NavigationTabs.tsx
import React from 'react';

interface NavigationTabsProps {
    activeSection: string;
    onSectionChange: (section: string) => void;
    sections?: string[];
}

export default function NavigationTabs({
                                           activeSection,
                                           onSectionChange,
                                           sections = ['overview', 'documents', 'mockups', 'team']
                                       }: NavigationTabsProps) {
    return (
        <div className="flex space-x-4 border-b">
            {sections.map((section) => (
                <button
                    key={section}
                    onClick={() => onSectionChange(section)}
                    className={`px-4 py-2 font-medium text-sm hover:text-blue-600 border-b-2 -mb-px ${activeSection === section
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500'
                    }`}
                >
                    {section.charAt(0).toUpperCase() + section.slice(1)}
                </button>
            ))}
        </div>
    );
}