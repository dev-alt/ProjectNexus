// components/mockups/MockupActions.tsx
import React, { useState } from 'react';
import { MoreVertical, Edit2, Trash2, ExternalLink } from 'lucide-react';
import type { Mockup } from "@/types/mockup";

interface MockupActionsProps {
    mockup: Mockup;
    onEdit: (mockup: Mockup) => void;
    onDelete: (mockup: Mockup) => void;
    onOpen: (mockup: Mockup) => void;
}

export const MockupActions: React.FC<MockupActionsProps> = ({
                                                                mockup,
                                                                onEdit,
                                                                onDelete,
                                                                onOpen,
                                                            }) => {
    const [showActions, setShowActions] = useState(false);

    return (
        <div className="relative">
            <button
                onClick={() => setShowActions(!showActions)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
                <MoreVertical className="h-5 w-5 text-gray-500" />
            </button>

            {showActions && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-10">
                    <div className="py-1">
                        <button
                            onClick={() => {
                                onOpen(mockup);
                                setShowActions(false);
                            }}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Open
                        </button>
                        <button
                            onClick={() => {
                                onEdit(mockup);
                                setShowActions(false);
                            }}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            <Edit2 className="h-4 w-4 mr-2" />
                            Edit
                        </button>
                        <button
                            onClick={() => {
                                onDelete(mockup);
                                setShowActions(false);
                            }}
                            className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
