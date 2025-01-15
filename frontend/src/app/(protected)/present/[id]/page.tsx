// app/present/[id]/page.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import ProjectHeader from '@/components/present/ProjectHeader';
import NavigationTabs from '@/components/present/NavigationTabs';
import ProjectOverview from '@/components/present/ProjectOverview';
import DocumentsGrid from '@/components/present/DocumentsGrid';
import TeamGrid from '@/components/present/TeamGrid';
import ShareDialog from '@/components/present/ShareDialog';
import DocumentViewer from '@/components/present/DocumentViewer';
import type { Document, ViewableItem } from '@/types/present';

// Type guard to check if item is a Document
const isDocument = (item: ViewableItem): item is Document => {
    return 'lastModified' in item;
};
import type { Document as APIDocument } from '@/types/documents';
import type { Document as PresentDocument, TeamMember as PresentTeamMember } from '@/types/present';
import { useProjects } from '@/lib/hooks/use-projects';
import { useDocuments } from '@/lib/hooks/use-documents';
import { useTeam } from '@/lib/hooks/use-team';
import { useToast } from '@/lib/hooks/use-toast';

// Helper functions to map between API types and presentation types
const mapAPIDocumentToPresent = (doc: APIDocument): PresentDocument => ({
    id: Number(doc.id),
    type: doc.type,
    title: doc.title,
    lastModified: doc.updatedAt,
    preview: '/api/placeholder/400/200' // Add placeholder preview
});

const mapTeamMemberToPresent = (member: { id: string; name: string; role: string }): PresentTeamMember => ({
    id: Number(member.id),
    name: member.name,
    role: member.role,
    avatar: `/api/placeholder/32/32`
});

export default function ProjectPresentation({ params }: { params: { id: string }}) {
    const router = useRouter();
    const { toast } = useToast();
    const [activeSection, setActiveSection] = useState<string>('overview');
    const [showShareDialog, setShowShareDialog] = useState<boolean>(false);
    const [selectedDocument, setSelectedDocument] = useState<PresentDocument | null>(null);

    // Fetch project data
    const { projects, isLoading: projectLoading } = useProjects();
    const { documents, isLoading: documentsLoading } = useDocuments();
    const { members, isLoading: teamLoading } = useTeam(params.id);

    const project = projects.find(p => p.id === params.id);
    const projectDocuments = documents.filter(d => d.projectId === params.id).map(mapAPIDocumentToPresent);
    const teamMembers = members.map(mapTeamMemberToPresent);

    // Share handlers
    const handleShare = () => {
        setShowShareDialog(true);
    };

    // Download handler
    const handleDownload = async () => {
        if (!selectedDocument) {
            toast({
                title: 'Error',
                description: 'Please select a document to download',
                variant: 'destructive'
            });
            return;
        }

        try {
            toast({
                title: 'Success',
                description: `Downloading ${selectedDocument.title}...`,
                variant: 'success'
            });
        } catch (error) {
            toast({
                title: 'Error',
                description: error instanceof Error ? error.message : 'Failed to download document',
                variant: 'destructive'
            });
        }
    };

    // Document handlers
    const handleDocumentClick = (doc: PresentDocument) => {
        setSelectedDocument(doc);
    };

    const handleDocumentShare = () => {
        setSelectedDocument(null);
        setShowShareDialog(true);
    };

    // Team member handlers
    const handleTeamMemberClick = (member: PresentTeamMember) => {
        router.push(`/team/${member.id}`);
    };

    if (projectLoading || documentsLoading || teamLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-semibold text-gray-900">Project not found</h2>
                <p className="mt-2 text-gray-600">The project you&#39;re looking for doesn&#39;t exist or you don&#39;t have access.</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-8">
            <ProjectHeader
                thumbnail={`/api/placeholder/800/400`}
                name={project.name}
                status={project.status}
                startDate={project.lastUpdated}
                endDate={project.lastUpdated}
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
                        onMockupClick={() => {}}
                    />
                )}

                {activeSection === 'documents' && (
                    <DocumentsGrid
                        documents={projectDocuments}
                        onDocumentClick={handleDocumentClick}
                    />
                )}

                {activeSection === 'team' && (
                    <TeamGrid
                        team={teamMembers}
                        onTeamMemberClick={handleTeamMemberClick}
                    />
                )}
            </div>

            {/* Dialogs and Modals */}
            <ShareDialog
                projectName={project.name}
                isOpen={showShareDialog}
                onClose={() => setShowShareDialog(false)}
            />

            {selectedDocument && (
                <DocumentViewer
                    item={selectedDocument}
                    onClose={() => setSelectedDocument(null)}
                    onShare={handleDocumentShare}
                    onDownload={handleDownload}
                    onEdit={(item) => {
                        setSelectedDocument(null);
                        if (isDocument(item)) {
                            router.push(`/documents/${item.id}/edit`);
                        }
                    }}
                />
            )}
        </div>
    );
}
