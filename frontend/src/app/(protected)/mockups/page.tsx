// //app/mockups/page.tsx
"use client";

import React, { useState } from 'react';
import {
    MockupHeader,
    MockupControls,
    MockupGrid,
    MockupList,
    MockupForm,
    MockupViewer,
    DeleteConfirmationDialog,
    MOCKUP_FILTER_TYPES,
} from '@/components/mockups';
import type { MockupFilterType } from '@/components/mockups';
import type { Mockup } from "@/types/mockup";
import { useMockups } from '@/lib/hooks/use-mockups';

export default function MockupsPage() {
    // State management
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedType, setSelectedType] = useState<MockupFilterType>('All Types');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [isCreating, setIsCreating] = useState(false);
    const [editingMockup, setEditingMockup] = useState<Mockup | null>(null);
    const [deletingMockup, setDeletingMockup] = useState<Mockup | null>(null);
    const [viewingMockup, setViewingMockup] = useState<Mockup | null>(null);

    // Custom hook for mockup data and operations
    const {
        mockups = [], // Provide empty array as default value
        isLoading,
        createMockup,
        updateMockup,
        deleteMockup,
    } = useMockups();

    // Filter mockups based on search query and selected type
    const filteredMockups = (mockups ?? []).filter((mockup) => {
        if (!mockup) return false;

        const matchesSearch =
            mockup.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            mockup.projectId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            mockup.createdBy?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesType = selectedType === 'All Types' || mockup.type === selectedType;

        return matchesSearch && matchesType;
    });

    // Event handlers
    const handleCreateMockup = async (data: Partial<Mockup>) => {
        if (!data.projectId || !data.name || !data.type || !data.tool || !data.status) {
            console.error('Missing required fields');
            return;
        }

        try {
            await createMockup({
                projectId: data.projectId,
                name: data.name,
                type: data.type,
                tool: data.tool,
                status: data.status,
                thumbnail: data.thumbnail
            });
            setIsCreating(false);
        } catch (error) {
            console.error('Failed to create mockup:', error);
        }
    };

    const handleUpdateMockup = async (data: Partial<Mockup>) => {
        if (!editingMockup?.id) {
            console.error('No mockup selected for editing');
            return;
        }

        try {
            await updateMockup(editingMockup.id, {
                name: data.name,
                type: data.type,
                tool: data.tool,
                status: data.status,
                thumbnail: data.thumbnail
            });
            setEditingMockup(null);
        } catch (error) {
            console.error('Failed to update mockup:', error);
        }
    };

    const handleDeleteMockup = async () => {
        if (!deletingMockup?.id) {
            console.error('No mockup selected for deletion');
            return;
        }

        try {
            await deleteMockup(deletingMockup.id);
            setDeletingMockup(null);
        } catch (error) {
            console.error('Failed to delete mockup:', error);
        }
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <MockupHeader onCreateNew={() => setIsCreating(true)} />

            <MockupControls
                searchQuery={searchQuery}
                selectedType={selectedType}
                viewMode={viewMode}
                onSearchChange={(e) => setSearchQuery(e.target.value)}
                onTypeChange={(e) => setSelectedType(e.target.value as MockupFilterType)}
                onViewModeChange={setViewMode}
                mockupTypes={MOCKUP_FILTER_TYPES}
            />

            {filteredMockups.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-500">No mockups found.</p>
                </div>
            ) : viewMode === 'grid' ? (
                <MockupGrid
                    mockups={filteredMockups}
                    onEdit={setEditingMockup}
                    onDelete={setDeletingMockup}
                    onOpen={setViewingMockup}
                />
            ) : (
                <MockupList
                    mockups={filteredMockups}
                    onEdit={setEditingMockup}
                    onDelete={setDeletingMockup}
                    onOpen={setViewingMockup}
                />
            )}

            {/* Modals */}
            {isCreating && (
                <MockupForm
                    onClose={() => setIsCreating(false)}
                    onSubmit={handleCreateMockup}
                />
            )}

            {editingMockup && (
                <MockupForm
                    mockup={editingMockup}
                    onClose={() => setEditingMockup(null)}
                    onSubmit={handleUpdateMockup}
                />
            )}

            {deletingMockup && (
                <DeleteConfirmationDialog
                    mockup={deletingMockup}
                    onConfirm={handleDeleteMockup}
                    onCancel={() => setDeletingMockup(null)}
                    isDeleting={isLoading}
                />
            )}

            {viewingMockup && (
                <MockupViewer
                    mockup={viewingMockup}
                    onClose={() => setViewingMockup(null)}
                    onEdit={(mockup) => {
                        setViewingMockup(null);
                        setEditingMockup(mockup);
                    }}
                />
            )}
        </div>
    );
}
