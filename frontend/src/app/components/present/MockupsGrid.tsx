// components/present/MockupsGrid.tsx
import React from 'react';
import Image from 'next/image';
import { ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Mockup } from '@/types/present';

interface MockupsGridProps {
    mockups: Mockup[];
    onMockupClick?: (mockup: Mockup) => void;
}

export default function MockupsGrid({ mockups, onMockupClick }: MockupsGridProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockups.map((mockup) => (
                <Card
                    key={mockup.id}
                    className="hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => onMockupClick?.(mockup)}
                >
                    <div className="relative">
                        <Image
                            src={mockup.preview}
                            alt={mockup.title}
                            width={400}
                            height={200}
                            className="w-full h-40 object-cover rounded-t-lg"
                        />
                        <button
                            className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-lg hover:bg-gray-100"
                            onClick={(e) => {
                                e.stopPropagation();
                                window.open(mockup.preview, '_blank');
                            }}
                        >
                            <ExternalLink className="h-4 w-4 text-gray-600" />
                        </button>
                    </div>
                    <CardContent className="p-4">
                        <h3 className="font-medium mb-1">{mockup.title}</h3>
                        <div className="flex justify-between items-center">
                            <p className="text-sm text-gray-500">{mockup.type}</p>
                            <p className="text-sm text-gray-500">{mockup.tool}</p>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}