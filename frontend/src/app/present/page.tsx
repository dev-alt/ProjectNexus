// app/present/page.tsx
"use client";

import React, { useState } from 'react';
import ProjectHeader from '@/components/present/ProjectHeader';
import NavigationTabs from '@/components/present/NavigationTabs';
import ProjectOverview from '@/components/present/ProjectOverview';
import DocumentsGrid from '@/components/present/DocumentsGrid';
import MockupsGrid from '@/components/present/MockupsGrid';
import TeamGrid from '@/components/present/TeamGrid';
import ShareDialog from '@/components/present/ShareDialog';
import DocumentViewer from '@/components/present/DocumentViewer';
import { Document, Mockup, ProjectData, TeamMember, ViewableItem } from '@/types/present';

const projectData: ProjectData = {
    id: 1,
    name: 'E-commerce Platform Redesign',
    description: 'A complete overhaul of the existing e-commerce platform with focus on improved user experience, faster checkout process, and modern design principles.',
    status: 'In Progress',
    progress: 65,
    startDate: '2024-01-01',
    endDate: '2024-06-30',
    thumbnail: '/api/placeholder/800/400',
    team: [
        { id: 1, name: 'Sarah Chen', role: 'Lead Designer', avatar: '/api/placeholder/32/32' },
        { id: 2, name: 'Alex Morrison', role: 'Tech Lead', avatar: '/api/placeholder/32/32' },
        { id: 3, name: 'Michael Scott', role: 'Project Manager', avatar: '/api/placeholder/32/32' },
    ],
    documents: [
        {
            id: 1,
            type: 'High-Level Design',
            title: 'System Architecture Overview',
            lastModified: '2024-01-10',
            preview: '/api/placeholder/400/200',
        },
        {
            id: 2,
            type: 'Technical Spec',
            title: 'API Integration Documentation',
            lastModified: '2024-01-15',
            preview: '/api/placeholder/400/200',
        },
    ],
    mockups: [
        {
            id: 1,
            title: 'User Dashboard',
            type: 'Wireframe',
            preview: '/api/placeholder/400/200',
            tool: 'Figma',
        },
        {
            id: 2,
            title: 'Mobile App Flow',
            type: 'Prototype',
            preview: '/api/placeholder/400/200',
            tool: 'Sketch',
        },
    ],
};

export default function ProjectPresentation() {
    const [activeSection, setActiveSection] = useState<string>('overview');
    const [showShareDialog, setShowShareDialog] = useState<boolean>(false);
    const [selectedItem, setSelectedItem] = useState<ViewableItem | null>(null);

    // Share handlers
    const handleShare = () => {
        setShowShareDialog(true);
    };

    // Download handler (Corrected to use selectedItem)
    const handleDownload = () => {
        if (selectedItem) {
            const fileName = selectedItem.title;
            console.log(`Downloading ${fileName}...`);
            alert(`Downloading ${fileName}...`);
        } else {
            // Handle case where no item is selected
            console.log('No item selected for download.');
            alert('Please select an item to download.');
        }
    };

    // Document handlers
    const handleDocumentClick = (doc: Document) => {
        setSelectedItem(doc);
    };

    const handleDocumentShare = () => {
        setSelectedItem(null);
        setShowShareDialog(true);
    };

    // Mockup handlers
    const handleMockupClick = (mockup: Mockup) => {
        setSelectedItem(mockup);
    };

    // Team member handlers
    const handleTeamMemberClick = (member: TeamMember) => {
        console.log('Team member clicked:', member);
        alert(`Viewing profile of ${member.name}`);
    };

    return (
        <div className="space-y-8 pb-8">
            <ProjectHeader
                thumbnail={projectData.thumbnail}
                name={projectData.name}
                status={projectData.status}
                startDate={projectData.startDate}
                endDate={projectData.endDate}
                onShare={handleShare}
                onDownload={handleDownload}
            />

            <NavigationTabs
                activeSection={activeSection}
                onSectionChange={setActiveSection}
            />

            <div className="space-y-6">
                {activeSection === 'overview' && (
                    <ProjectOverview
                        description={projectData.description}
                        progress={projectData.progress}
                        documents={projectData.documents}
                        mockups={projectData.mockups}
                        onDocumentClick={handleDocumentClick}
                        onMockupClick={handleMockupClick}
                    />
                )}

                {activeSection === 'documents' && (
                    <DocumentsGrid
                        documents={projectData.documents}
                        onDocumentClick={handleDocumentClick}
                    />
                )}

                {activeSection === 'mockups' && (
                    <MockupsGrid
                        mockups={projectData.mockups}
                        onMockupClick={handleMockupClick}
                    />
                )}

                {activeSection === 'team' && (
                    <TeamGrid
                        team={projectData.team}
                        onTeamMemberClick={handleTeamMemberClick}
                    />
                )}
            </div>

            {/* Dialogs and Modals */}
            <ShareDialog
                projectName={projectData.name}
                isOpen={showShareDialog}
                onClose={() => setShowShareDialog(false)}
            />

            <DocumentViewer
                item={selectedItem}
                onClose={() => setSelectedItem(null)}
                onShare={handleDocumentShare}
                onDownload={handleDownload}
            />
        </div>
    );
}