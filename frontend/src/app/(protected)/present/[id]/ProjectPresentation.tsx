// app/present/[id]/page.tsx
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import ProjectHeader from '@/components/present/ProjectHeader';
import NavigationTabs from '@/components/present/NavigationTabs';
import ProjectOverview from '@/components/present/ProjectOverview';
import DocumentsGrid from '@/components/present/DocumentsGrid';
import MockupsGrid from '@/components/present/MockupsGrid';
import TeamGrid from '@/components/present/TeamGrid';
import ShareDialog from '@/components/present/ShareDialog';
import DocumentViewer from '@/components/present/DocumentViewer';
import { useProjects } from '@/lib/hooks/use-projects';
import { useDocuments } from '@/lib/hooks/use-documents';
import { useTeams } from '@/lib/hooks/use-teams';
import { useToast } from '@/lib/hooks/use-toast';
import {
    APIDocument,
    PresentDocument,
    PresentTeamMember,
    ViewableItem,
    Mockup
} from '@/types/types';
// Type guards
const isDocument = (item: ViewableItem): item is PresentDocument => 'lastModified' in item;
const isMockup = (item: ViewableItem): item is Mockup => 'tool' in item;

// Mapping functions
const mapAPIDocumentToPresent = (doc: APIDocument): PresentDocument => ({
    id: Number(doc.id),
    type: doc.type || 'Document',
    title: doc.title,
    lastModified: doc.updatedAt,
    preview: '/api/placeholder/400/200'
});

const mapTeamMemberToPresent = (member: { id: string; name: string; role: string }): PresentTeamMember => ({
    id: Number(member.id),
    name: member.name,
    role: member.role,
    avatar: `/api/placeholder/32/32`
});

interface ProjectPresentationProps {
    id: string;
}

export default function ProjectPresentation({ id }: ProjectPresentationProps) {
    const router = useRouter();
    const { toast } = useToast();
    const [activeSection, setActiveSection] = useState<string>('overview');
    const [showShareDialog, setShowShareDialog] = useState<boolean>(false);
    const [selectedItem, setSelectedItem] = useState<ViewableItem | null>(null);

    // Data fetching hooks
    const { projects, isLoading: projectLoading } = useProjects();
    const { documents, isLoading: documentsLoading } = useDocuments();
    const { teams, isLoading: teamLoading } = useTeams();

    // Find current project and related data
    const project = projects.find((p) => p.id === id);
    const projectDocuments = documents
        .filter((d) => d.projectId === id)
        .map(mapAPIDocumentToPresent);
    const teamMembers = teams
        .flatMap((team) => team.members)
        .map(mapTeamMemberToPresent);

    // Loading state
    if (projectLoading || documentsLoading || teamLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    // Error state
    if (!project) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-semibold text-gray-900">Project not found</h2>
                <p className="mt-2 text-gray-600">
                    The project you&#39;re looking for doesn&#39;t exist or you don&#39;t have access.
                </p>
            </div>
        );
    }

    // Event handlers
    const handleShare = () => setShowShareDialog(true);

    const handleDownload = async () => {
        if (!selectedItem) {
            toast({
                title: 'Error',
                description: 'Please select an item to download',
                variant: 'destructive'
            });
            return;
        }

        try {
            toast({
                title: 'Success',
                description: `Downloading ${selectedItem.title}...`,
                variant: 'success'
            });
            // Implement actual download logic here
        } catch (error) {
            toast({
                title: 'Error',
                description: error instanceof Error ? error.message : 'Failed to download item',
                variant: 'destructive'
            });
        }
    };

    const handleDocumentClick = (doc: PresentDocument) => setSelectedItem(doc);
    const handleMockupClick = (mockup: Mockup) => setSelectedItem(mockup);
    const handleTeamMemberClick = (member: PresentTeamMember) => router.push(`/team/${member.id}`);

    const handleEdit = (item: ViewableItem) => {
        setSelectedItem(null);
        if (isDocument(item)) {
            router.push(`/documents/${item.id}/edit`);
        } else if (isMockup(item)) {
            router.push(`/mockups/${item.id}/edit`);
        }
    };

    return (
        <div className="space-y-8 pb-8">
            <ProjectHeader
                thumbnail={`/api/placeholder/800/400`}
                name={project.name}
                status={project.status}
                startDate={project.startDate}
                endDate={project.endDate}
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
                        description={project.description}
                        progress={project.progress}
                        documents={projectDocuments}
                        mockups={[]}
                        onDocumentClick={handleDocumentClick}
                        onMockupClick={handleMockupClick}
                    />
                )}

                {activeSection === 'documents' && (
                    <DocumentsGrid
                        documents={projectDocuments}
                        onDocumentClick={handleDocumentClick}
                    />
                )}

                {activeSection === 'mockups' && (
                    <MockupsGrid
                        mockups={[]}
                        onMockupClick={handleMockupClick}
                    />
                )}

                {activeSection === 'team' && (
                    <TeamGrid
                        team={teamMembers}
                        onTeamMemberClick={handleTeamMemberClick}
                    />
                )}
            </div>

            <ShareDialog
                projectName={project.name}
                isOpen={showShareDialog}
                onClose={() => setShowShareDialog(false)}
            />

            {selectedItem && (
                <DocumentViewer
                    item={selectedItem}
                    onClose={() => setSelectedItem(null)}
                    onShare={handleShare}
                    onDownload={handleDownload}
                    onEdit={handleEdit}
                />
            )}
        </div>
    );
}
