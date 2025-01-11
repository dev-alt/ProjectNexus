import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { Search, X, Clock, Layout, File, Users, ArrowRight } from 'lucide-react';

type SearchHistoryItem = {
    id: string;
    query: string;
    timestamp: string;
};
type SearchSuggestion = {
    id: string;
    text: string;
    type: 'project' | 'document' | 'person';
};

interface SearchBarProps {
    onSearch: (query: string) => void;
}

const shortcuts = [
    { key: 'P', label: 'Projects', icon: Layout, href: '/projects' },
    { key: 'D', label: 'Documents', icon: File, href: '/documents' },
    { key: 'T', label: 'Team', icon: Users, href: '/team' },
];

const SearchBar = ({ onSearch }: SearchBarProps) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [recentSearches, setRecentSearches] = useState<SearchHistoryItem[]>([]);
    const searchRef = useRef<HTMLDivElement>(null);

    // Load recent searches from localStorage
    useEffect(() => {
        const savedSearches = localStorage.getItem('projectnexus-recent-searches');
        if (savedSearches) {
            setRecentSearches(JSON.parse(savedSearches));
        }
    }, []);

    // Example suggestions - in a real app, these would be fetched based on the query
    const suggestions: SearchSuggestion[] = [
        { id: '1', text: 'E-commerce Platform', type: 'project' as const },
        { id: '2', text: 'API Documentation', type: 'document' as const },
        { id: '3', text: 'Sarah Chen', type: 'person' as const },
        { id: '4', text: 'Mobile App Design', type: 'project' as const },
    ].filter((item) =>
        item.text.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSearchSubmit = (query: string) => {
        if (!query.trim()) return;

        const newSearch = {
            id: Date.now().toString(),
            query: query.trim(),
            timestamp: 'Just now',
        };

        const updatedSearches = [newSearch, ...recentSearches.slice(0, 4)];
        setRecentSearches(updatedSearches);
        localStorage.setItem(
            'projectnexus-recent-searches',
            JSON.stringify(updatedSearches)
        );

        onSearch(query);
        setSearchQuery('');
        setShowDropdown(false);
    };

    // Handle keyboard shortcuts
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setShowDropdown(true);
            } else if (e.key === 'Escape') {
                setShowDropdown(false);
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [showDropdown]); // Add showDropdown to dependency array

    // Handle click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                searchRef.current &&
                !searchRef.current.contains(event.target as Node)
            ) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="flex-1 max-w-xl relative" ref={searchRef}>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search (⌘K)"
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setShowDropdown(true);
                    }}
                    onFocus={() => setShowDropdown(true)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                    bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                    focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {searchQuery && (
                    <button
                        onClick={() => {
                            setSearchQuery('');
                            setShowDropdown(false);
                        }}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>

            {showDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto z-10">
                    {/* Quick Navigation */}
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
                            Quick Navigation
                        </h3>
                        <div className="grid grid-cols-3 gap-2">
                            {shortcuts.map((shortcut) => {
                                const Icon = shortcut.icon;
                                return (
                                    <Link
                                        key={shortcut.key}
                                        href={shortcut.href}
                                        onClick={() => setShowDropdown(false)} // Close dropdown on link click
                                        className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                                    >
                                        <Icon className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
                                        <span className="text-sm text-gray-700 dark:text-gray-300">
                      {shortcut.label}
                    </span>
                                        <kbd className="ml-auto text-xs text-gray-400 dark:text-gray-500">
                                            ⌘{shortcut.key}
                                        </kbd>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* Recent Searches */}
                    {recentSearches.length > 0 && !searchQuery && (
                        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
                                Recent Searches
                            </h3>
                            {recentSearches.map((search) => (
                                <button
                                    key={search.id}
                                    onClick={() => handleSearchSubmit(search.query)}
                                    className="flex items-center w-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                                >
                                    <Clock className="h-4 w-4 text-gray-400 mr-2" />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">
                    {search.query}
                  </span>
                                    <span className="ml-auto text-xs text-gray-400">
                    {search.timestamp}
                  </span>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Search Suggestions */}
                    {searchQuery && suggestions.length > 0 && (
                        <div className="p-4">
                            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
                                Suggestions
                            </h3>
                            {suggestions.map((suggestion) => {
                                const Icon =
                                    suggestion.type === 'project'
                                        ? Layout
                                        : suggestion.type === 'document'
                                            ? File
                                            : Users;
                                return (
                                    <button
                                        key={suggestion.id}
                                        onClick={() => handleSearchSubmit(suggestion.text)}
                                        className="flex items-center w-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                                    >
                                        <Icon className="h-4 w-4 text-gray-400 mr-2" />
                                        <span className="text-sm text-gray-700 dark:text-gray-300">
                      {suggestion.text}
                    </span>
                                        <span className="ml-auto text-xs text-gray-400 flex items-center">
                      {suggestion.type}
                                            <ArrowRight className="h-3 w-3 ml-1" />
                    </span>
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    {/* No Results */}
                    {searchQuery && suggestions.length === 0 && (
                        <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                            No results found for &quot;{searchQuery}&quot;
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchBar;