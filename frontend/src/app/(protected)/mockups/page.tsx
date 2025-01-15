// app/mockups/page.tsx
'use client';

import React, { useState } from 'react';
import { MockupHeader, MockupControls, MockupGrid, MockupList } from '@/components/mockups/Mockups';
import MockupForm from '@/components/mockups/MockupForm';
import DeleteConfirmationDialog from '@/components/mockups/DeleteConfirmationDialog';
import MockupViewer from '@/components/mockups/MockupViewer';
import {Mockup} from "@/types/mockup";

// Mockup types for filtering
const mockupTypes = ['All Types', 'Wireframe', 'Prototype', 'High-fidelity'];

// Mock data - in a real app this would come from an API
const initialMockups = [
    {
        id: 1,
        name: 'User Dashboard Wireframe',
        project: 'E-commerce Platform',
        type: 'Wireframe',
        lastModified: '2024-01-10T10:30:00',
        author: 'Sarah Chen',
        status: 'In Review',
        thumbnail: '/api/placeholder/300/200',
        tool: 'Figma',
    },
    {
        id: 2,
        name: 'Mobile App Flow',
        project: 'Mobile App Redesign',
        type: 'Prototype',
        lastModified: '2024-01-09T15:45:00',
        author: 'Alex Morrison',
        status: 'Approved',
        thumbnail: '/api/placeholder/300/200',
        tool: 'Sketch',
    },
    {
        id: 3,
        name: 'Settings Page Design',
        project: 'API Integration',
        type: 'High-fidelity',
        lastModified: '2024-01-08T09:15:00',
        author: 'Michael Scott',
        status: 'Draft',
        thumbnail: '/api/placeholder/300/200',
        tool: 'Adobe XD',
    },
];

export default function MockupsPage() {
    // State management
    const [mockups, setMockups] = useState(initialMockups);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedType, setSelectedType] = useState('All Types');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    // Modal states
    const [isCreating, setIsCreating] = useState(false);
    const [editingMockup, setEditingMockup] = useState<Mockup | null>(null);
    const [deletingMockup, setDeletingMockup] = useState<Mockup | null>(null);
    const [viewingMockup, setViewingMockup] = useState<Mockup | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Filter mockups based on search query and selected type
    const filteredMockups = mockups.filter((mockup) => {
        const matchesSearch =
            mockup.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            mockup.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
            mockup.author.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesType = selectedType === 'All Types' || mockup.type === selectedType;

        return matchesSearch && matchesType;
    });

    // Create mockup handler
    const handleCreateMockup = async (data: Partial<Mockup>) => {
        const newMockup = {
            ...data,
            id: Math.max(...mockups.map(m => m.id)) + 1,
        } as Mockup;

        setMockups([...mockups, newMockup]);
        setIsCreating(false);
    };

    // Update mockup handler
    const handleUpdateMockup = async (data: Partial<Mockup>) => {
        if (!editingMockup) return;

        setMockups(mockups.map(mockup =>
            mockup.id === editingMockup.id
                ? { ...mockup, ...data }
                : mockup
        ));
        setEditingMockup(null);
    };

    // Delete mockup handler
    const handleDeleteMockup = async () => {
        if (!deletingMockup) return;

        setIsDeleting(true);
        try {
            // In a real app, you would call an API here
            setMockups(mockups.filter(m => m.id !== deletingMockup.id));
            setDeletingMockup(null);
        } finally {
            setIsDeleting(false);
        }
    };

    // Open mockup handler
    const handleOpenMockup = (mockup: Mockup) => {
        setViewingMockup(mockup);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <MockupHeader onCreateNew={() => setIsCreating(true)} />

            {/* Controls */}
            <MockupControls
                searchQuery={searchQuery}
                selectedType={selectedType}
                viewMode={viewMode}
                onSearchChange={(e) => setSearchQuery(e.target.value)}
                onTypeChange={(e) => setSelectedType(e.target.value)}
                onViewModeChange={setViewMode}
                mockupTypes={mockupTypes}
            />

            {/* Mockups Display */}
            {viewMode === 'grid' ? (
                <MockupGrid
                    mockups={filteredMockups}
                    onEdit={setEditingMockup}
                    onDelete={setDeletingMockup}
                    onOpen={handleOpenMockup}
                />
            ) : (
                <MockupList
                    mockups={filteredMockups}
                    onEdit={setEditingMockup}
                    onDelete={setDeletingMockup}
                    onOpen={handleOpenMockup}
                />
            )}

            {/* Create Modal */}
            {isCreating && (
                <MockupForm
                    onClose={() => setIsCreating(false)}
                    onSubmit={handleCreateMockup}
                />
            )}

            {/* Edit Modal */}
            {editingMockup && (
                <MockupForm
                    mockup={editingMockup}
                    onClose={() => setEditingMockup(null)}
                    onSubmit={handleUpdateMockup}
                />
            )}

            {/* Delete Confirmation */}
            {deletingMockup && (
                <DeleteConfirmationDialog
                    mockup={deletingMockup}
                    onConfirm={handleDeleteMockup}
                    onCancel={() => setDeletingMockup(null)}
                    isDeleting={isDeleting}
                />
            )}

            {/* Mockup Viewer */}
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
