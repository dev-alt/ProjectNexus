import React from 'react';
import { Moon, Sun } from 'lucide-react';

interface ThemeToggleProps {
    isDark: boolean;
    onToggle: () => void;
}

const ThemeToggle = ({ isDark, onToggle }: ThemeToggleProps) => {
    return (
        <button
            onClick={onToggle}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
            {isDark ? (
                <Sun className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            ) : (
                <Moon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            )}
        </button>
    );
};

export default ThemeToggle;