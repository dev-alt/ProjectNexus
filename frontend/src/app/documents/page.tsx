// app/documents/page.tsx
'use client';

import React, { useState } from 'react';
import { Filter, Plus } from 'lucide-react';
import Button from '@/components/ui/Button';
import SearchInput from '@/components/ui/SearchInput';
import Select from '@/components/ui/Select';
import DocumentCard from '@/components/ui/DocumentCard';
import DocumentForm from '@/components/ui/DocumentForm';
import DocumentViewer from '@/components/ui/DocumentViewer';
import { Document } from '@/types/types';

interface DocumentFormData {
    title: string;
    type: string;
    project: string;
    content: string;
}
// Mock data - replace with actual data fetching
const initialDocuments: Document[] = [
    {
        id: 1,
        title: 'E-commerce Platform HLD',
        type: 'High-Level Design',
        project: 'E-commerce Platform',
        content: 'This is the high-level design document for our e-commerce platform. It outlines the major components and their interactions, including the user interface, backend services, and database schema. The design focuses on scalability and maintainability, ensuring the platform can handle a growing number of users and products. Key features include user authentication, product catalog, shopping cart, and payment processing. The document also includes a deployment strategy and monitoring plan.',
        lastModified: '2024-01-10T10:30:00',
        author: 'Alex Morrison',
        status: 'In Review'
    },
    {
        id: 2,
        title: 'Mobile App Architecture',
        type: 'Architecture',
        project: 'Mobile App Redesign',
        content: 'Mobile app architecture specifications and guidelines. This document outlines the architecture for the redesign of our mobile application. It includes details on the chosen architecture pattern (MVVM), data flow, and component structure. The architecture is designed to improve performance, enhance user experience, and facilitate easier maintenance and updates. Key aspects covered include navigation, state management, data caching, and API communication.',
        lastModified: '2024-01-09T15:45:00',
        author: 'Sarah Chen',
        status: 'Draft'
    },
    {
        id: 3,
        title: 'API Integration Specs',
        type: 'Technical Spec',
        project: 'API Integration',
        content: 'API integration specifications and implementation details. This technical specification document details the integration of external APIs into our system. It includes information on authentication methods, data formats, endpoints, and error handling. The document provides guidelines for developers on how to interact with these APIs, ensuring consistency and reliability. It also covers aspects of rate limiting, security, and data validation.',
        lastModified: '2024-01-08T09:15:00',
        author: 'Michael Scott',
        status: 'Approved'
    }
];

const documentTypes = [
    { value: 'all', label: 'All Documents' },
    { value: 'High-Level Design', label: 'High-Level Design' },
    { value: 'Low-Level Design', label: 'Low-Level Design' },
    { value: 'Architecture', label: 'Architecture' },
    { value: 'Technical Spec', label: 'Technical Spec' },
    { value: 'Requirements', label: 'Requirements' }
];

type ModalState = {
    type: 'none' | 'create' | 'edit' | 'view';
    document?: Document;
};

export default function DocumentsPage() {
    const [documents, setDocuments] = useState<Document[]>(initialDocuments);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedType, setSelectedType] = useState('all');
    const [modalState, setModalState] = useState<ModalState>({ type: 'none' });
    const [isLoading, setIsLoading] = useState(false);

    const filteredDocuments = documents.filter(doc => {
        const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doc.project.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = selectedType === 'all' || doc.type === selectedType;
        return matchesSearch && matchesType;
    });

    const handleCreateDocument = async (formData: DocumentFormData) => {
        try {
            setIsLoading(true);

            // In a real application, this would be an API call
            const newDocument = {
                id: documents.length + 1,
                title: formData.title,
                type: formData.type,
                project: formData.project,
                content: formData.content,
                lastModified: new Date().toISOString(),
                author: 'Current User', // This would come from auth context
                status: 'Draft'
            };

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            setDocuments(prev => [...prev, newDocument]);
            setModalState({ type: 'none' });
        } catch (error) {
            console.error('Error creating document:', error);
            // Here you would show an error notification
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateDocument = async (formData: DocumentFormData) => {
        if (!modalState.document) return;

        try {
            setIsLoading(true);

            // In a real application, this would be an API call
            const updatedDocument = {
                ...modalState.document,
                ...formData,
                lastModified: new Date().toISOString(),
            };

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            setDocuments(prev =>
                prev.map(doc =>
                    doc.id === updatedDocument.id ? updatedDocument : doc
                )
            );
            setModalState({ type: 'none' });
        } catch (error) {
            console.error('Error updating document:', error);
            // Here you would show an error notification
        } finally {
            setIsLoading(false);
        }
    };

    const handleDocumentDelete = async (doc: Document) => {
        if (window.confirm('Are you sure you want to delete this document?')) {
            try {
                // In a real application, this would be an API call
                await new Promise(resolve => setTimeout(resolve, 500));
                setDocuments(prev => prev.filter(d => d.id !== doc.id));
            } catch (error) {
                console.error('Error deleting document:', error);
                // Here you would show an error notification
            }
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold">Documents</h1>
                <Button
                    leftIcon={<Plus className="h-4 w-4" />}
                    onClick={() => setModalState({ type: 'create' })}
                >
                    New Document
                </Button>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <SearchInput
                    placeholder="Search documents..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-grow"
                />
                <div className="flex gap-2">
                    <Select
                        options={documentTypes}
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                    />
                    <Button
                        variant="secondary"
                        leftIcon={<Filter className="h-5 w-5" />}
                        aria-label="Additional filters"
                    />
                </div>
            </div>

            {/* Document Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredDocuments.map((doc) => (
                    <DocumentCard
                        key={doc.id}
                        document={doc}
                        onView={() => setModalState({ type: 'view', document: doc })}
                        onEdit={() => setModalState({ type: 'edit', document: doc })}
                        onDelete={handleDocumentDelete}
                    />
                ))}
            </div>

            {/* Modals */}
            {modalState.type === 'create' && (
                <DocumentForm
                    onSubmit={handleCreateDocument}
                    onClose={() => setModalState({ type: 'none' })}
                    isLoading={isLoading}
                />
            )}

            {modalState.type === 'edit' && modalState.document && (
                <DocumentForm
                    initialData={modalState.document}
                    onSubmit={handleUpdateDocument}
                    onClose={() => setModalState({ type: 'none' })}
                    isLoading={isLoading}
                />
            )}

            {modalState.type === 'view' && modalState.document && (
                <DocumentViewer
                    document={modalState.document}
                    onClose={() => setModalState({ type: 'none' })}
                    onEdit={() => setModalState({ type: 'edit', document: modalState.document })}
                />
            )}
        </div>
    );
}