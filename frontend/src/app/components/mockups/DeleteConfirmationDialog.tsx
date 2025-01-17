// components/mockups/DeleteConfirmationDialog.tsx
import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Mockup } from '@/types/mockup';

interface DeleteConfirmationDialogProps {
    mockup: Mockup;
    onConfirm: () => void;
    onCancel: () => void;
    isDeleting: boolean;
}

export const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
                                                                                      mockup,
                                                                                      onConfirm,
                                                                                      onCancel,
                                                                                      isDeleting
                                                                                  }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md">
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-2">
                        <AlertTriangle className="h-6 w-6 text-red-500" />
                        <h2 className="text-xl font-semibold">Delete Mockup</h2>
                    </div>
                    <button
                        onClick={onCancel}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="p-6">
                    <p className="text-gray-700 dark:text-gray-300">
                        Are you sure you want to delete the mockup{' '}
                        <span className="font-semibold">{mockup.name}</span>? This action cannot be
                        undone.
                    </p>

                    <div className="mt-6 flex justify-end space-x-3">
                        <Button
                            variant="secondary"
                            onClick={onCancel}
                            disabled={isDeleting}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="danger"
                            onClick={onConfirm}
                            isLoading={isDeleting}
                        >
                            Delete Mockup
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
