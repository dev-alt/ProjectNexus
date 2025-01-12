// components/present/ProjectHeader.tsx
import React from 'react';
import Image from 'next/image';
import { Share2, Download } from 'lucide-react';
import Button from '@/components/ui/Button';

interface ProjectHeaderProps {
    thumbnail: string;
    name: string;
    status: string;
    startDate: string;
    endDate: string;
    onShare?: () => void;
    onDownload?: () => void;
}

export default function ProjectHeader({
                                          thumbnail,
                                          name,
                                          status,
                                          startDate,
                                          endDate,
                                          onShare,
                                          onDownload
                                      }: ProjectHeaderProps) {
    return (
        <div className="relative h-64 bg-gray-900 rounded-lg overflow-hidden">
            <Image
                src={thumbnail}
                alt={name}
                fill
                className="object-cover opacity-50"
            />
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-gray-900 to-transparent">
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">{name}</h1>
                        <div className="flex items-center space-x-4">
                            <span className="px-3 py-1 bg-blue-500 text-white rounded-full text-sm">
                                {status}
                            </span>
                            <span className="text-gray-300 text-sm">
                                {new Date(startDate).toLocaleDateString()} -
                                {new Date(endDate).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                    <div className="flex space-x-2">
                        {onShare && (
                            <Button
                                variant="ghost"
                                onClick={onShare}
                                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white"
                            >
                                <Share2 className="h-5 w-5" />
                            </Button>
                        )}
                        {onDownload && (
                            <Button
                                variant="ghost"
                                onClick={onDownload}
                                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white"
                            >
                                <Download className="h-5 w-5" />
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}