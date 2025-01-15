// app/documents/page.tsx
'use client';

import React, { useState } from 'react';
import { Filter, Plus } from 'lucide-react';
import Button from '@/components/ui/Button';
import SearchInput from '@/components/ui/SearchInput';
import Select from '@/components/ui/Select';
import DocumentCard from '@/components/documents/DocumentCard';
import DocumentForm from '@/components/documents/DocumentForm';
import DocumentViewer from '@/components/documents/DocumentViewer';
import { useDocuments } from '@/lib/hooks/use-documents';
import { Document, DocumentFormData } from '@/types/documents';


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
    // State
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedType, setSelectedType] = useState('all');
    const [modalState, setModalState] = useState<ModalState>({ type: 'none' });

    // Custom hook for document operations
    const { documents, isLoading, createDocument, updateDocument, deleteDocument } = useDocuments();

    // Filter documents based on search and type
    const filteredDocuments = documents.filter(doc => {
        const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doc.projectId.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = selectedType === 'all' || doc.type === selectedType;
        return matchesSearch && matchesType;
    });

    // Form handlers with proper typing
    const handleCreateDocument = async (formData: DocumentFormData) => {
        try {
            await createDocument(formData);
            setModalState({ type: 'none' });
        } catch (error) {
            console.error('Failed to create document:', error);
        }
    };

    const handleUpdateDocument = async (formData: DocumentFormData) => {
        if (!modalState.document) return;

        try {
            await updateDocument(modalState.document.id, formData);
            setModalState({ type: 'none' });
        } catch (error) {
            console.error('Failed to update document:', error);
        }
    };

    const handleDeleteDocument = async (doc: Document) => {
        if (window.confirm('Are you sure you want to delete this document?')) {
            try {
                await deleteDocument(doc.id);
            } catch (error) {
                console.error('Failed to delete document:', error);
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
                    disabled={isLoading}
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
                        onDelete={() => handleDeleteDocument(doc)}
                    />
                ))}
            </div>
                        {/* Loading State */}
                        {isLoading && (
                            <div className="flex justify-center items-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            </div>
                        )}

                        {/* Empty State */}
                        {!isLoading && filteredDocuments.length === 0 && (
                            <div className="text-center py-8">
                                <p className="text-gray-500">No documents found{searchQuery && ' for your search'}.</p>
                                <Button
                                    variant="secondary"
                                    onClick={() => setModalState({ type: 'create' })}
                                    className="mt-4"
                                >
                                    Create your first document
                                </Button>
                            </div>
                        )}

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

