// components/present/DocumentsGrid.tsx
import React from 'react';
import Image from 'next/image';
import { ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Document } from '@/types/present';

interface DocumentsGridProps {
    documents: Document[];
    onDocumentClick?: (document: Document) => void;
}

export default function DocumentsGrid({ documents, onDocumentClick }: DocumentsGridProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.map((doc) => (
                <Card
                    key={doc.id}
                    className="hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => onDocumentClick?.(doc)}
                >
                    <div className="relative">
                        <Image
                            src={doc.preview}
                            alt={doc.title}
                            width={400}
                            height={200}
                            className="w-full h-40 object-cover rounded-t-lg"
                        />
                        <button
                            className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-lg hover:bg-gray-100"
                            onClick={(e) => {
                                e.stopPropagation();
                                window.open(doc.preview, '_blank');
                            }}
                        >
                            <ExternalLink className="h-4 w-4 text-gray-600" />
                        </button>
                    </div>
                    <CardContent className="p-4">
                        <h3 className="font-medium mb-1">{doc.title}</h3>
                        <p className="text-sm text-gray-500">{doc.type}</p>
                        <p className="text-sm text-gray-500 mt-2">
                            Last modified: {new Date(doc.lastModified).toLocaleDateString()}
                        </p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}