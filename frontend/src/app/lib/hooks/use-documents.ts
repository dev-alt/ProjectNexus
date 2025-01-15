// app/hooks/use-documents.ts
import { useState, useEffect, useCallback } from 'react';
import { documentsApi } from '@/lib/api/documents';
import type {
    Document as ProjectDocument,  // Rename to avoid collision
    DocumentFormData,
    CreateDocumentInput,
    UpdateDocumentInput
} from '@/types/documents';
import { useToast } from '@/lib/hooks/use-toast';

export function useDocuments() {
    const [documents, setDocuments] = useState<ProjectDocument[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const fetchDocuments = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await documentsApi.getAll();
            if (Array.isArray(data)) {
                setDocuments(data as unknown as ProjectDocument[]);
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: error instanceof Error ? error.message : 'Failed to fetch documents',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    }, [toast]);

    const createDocument = async (formData: DocumentFormData) => {
        try {
            setIsLoading(true);
            const input: CreateDocumentInput = {
                projectId: formData.project,
                title: formData.title,
                type: formData.type,
                content: formData.content,
                status: formData.status,
            };
            const newDocument = await documentsApi.create(input);
            setDocuments((prevDocuments) => [...prevDocuments, newDocument] as ProjectDocument[]);
            toast({
                title: 'Success',
                description: 'Document created successfully',
                variant: 'success',
            });
            return newDocument;
        } catch (error) {
            toast({
                title: 'Error',
                description: error instanceof Error ? error.message : 'Failed to create document',
                variant: 'destructive',
            });
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const updateDocument = async (id: string, formData: Partial<DocumentFormData>) => {
        try {
            setIsLoading(true);
            const updateInput: UpdateDocumentInput = {
                title: formData.title,
                type: formData.type,
                content: formData.content,
                status: formData.status,
            };
            const updatedDocument = await documentsApi.update(id, updateInput);
            setDocuments((prevDocuments) =>
                prevDocuments.map((doc) =>
                    doc.id === id ? { ...doc, ...updatedDocument } as ProjectDocument : doc
                )
            );
            toast({
                title: 'Success',
                description: 'Document updated successfully',
                variant: 'success',
            });
            return updatedDocument;
        } catch (error) {
            toast({
                title: 'Error',
                description: error instanceof Error ? error.message : 'Failed to update document',
                variant: 'destructive',
            });
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const deleteDocument = async (id: string) => {
        try {
            setIsLoading(true);
            await documentsApi.delete(id);
            setDocuments((prevDocuments) => prevDocuments.filter((doc) => doc.id !== id));
            toast({
                title: 'Success',
                description: 'Document deleted successfully',
                variant: 'success',
            });
        } catch (error) {
            toast({
                title: 'Error',
                description: error instanceof Error ? error.message : 'Failed to delete document',
                variant: 'destructive',
            });
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        void fetchDocuments();
    }, [fetchDocuments]);

    return {
        documents,
        isLoading,
        createDocument,
        updateDocument,
        deleteDocument,
        refreshDocuments: fetchDocuments,
    };
}
