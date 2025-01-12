// DeleteProjectDialog.tsx
import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Project } from '@/types/types';

interface DeleteProjectDialogProps {
    project: Project;
    onConfirm: () => void;
    onCancel: () => void;
    isDeleting?: boolean;
}

export const DeleteProjectDialog: React.FC<DeleteProjectDialogProps> = ({
                                                                            project,
                                                                            onConfirm,
                                                                            onCancel,
                                                                            isDeleting = false,
                                                                        }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-2">
                        <AlertTriangle className="h-6 w-6 text-red-500" />
                        <h2 className="text-xl font-semibold">Delete Project</h2>
                    </div>
                    <button
                        onClick={onCancel}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <p className="text-gray-700 dark:text-gray-300">
                        Are you sure you want to delete the project{' '}
                        <span className="font-semibold">{project.name}</span>? This action cannot be
                        undone.
                    </p>

                    <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                        <p>This will permanently delete:</p>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                            <li>All project documents and files</li>
                            <li>Team assignments and roles</li>
                            <li>Project history and activity logs</li>
                            <li>Associated comments and discussions</li>
                        </ul>
                    </div>

                    <div className="mt-6 text-sm bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg">
                        <p>
                            Please type <span className="font-mono font-bold">{project.name}</span> to
                            confirm.
                        </p>
                        <input
                            type="text"
                            className="mt-2 w-full px-3 py-2 border border-red-300 dark:border-red-700 rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-red-900/20"
                            placeholder="Type project name here"
                        />
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
                    <Button variant="secondary" onClick={onCancel} disabled={isDeleting}>
                        Cancel
                    </Button>
                    <Button
                        variant="danger"
                        onClick={onConfirm}
                        isLoading={isDeleting}
                        disabled={isDeleting}
                    >
                        Delete Project
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default DeleteProjectDialog;