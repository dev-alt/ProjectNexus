// components/present/ShareDialog.tsx
import React, { useState } from 'react';
import { X, Copy, Mail, Link } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface ShareDialogProps {
    projectName: string;
    onClose: () => void;
    isOpen: boolean;
}

export default function ShareDialog({ projectName, onClose, isOpen }: ShareDialogProps) {
    const [copied, setCopied] = useState(false);
    const [email, setEmail] = useState('');

    if (!isOpen) return null;

    const shareLink = `https://projectnexus.com/projects/${projectName.toLowerCase().replace(/\s+/g, '-')}`;

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(shareLink);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy link:', err);
        }
    };

    const handleEmailShare = () => {
        const subject = `Check out ${projectName} on ProjectNexus`;
        const body = `I wanted to share ${projectName} with you on ProjectNexus:\n\n${shareLink}`;
        window.open(`mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md">
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-semibold">Share Project</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="p-4 space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Project Link
                        </label>
                        <div className="flex space-x-2">
                            <Input
                                value={shareLink}
                                readOnly
                                className="flex-1"
                            />
                            <Button
                                variant={copied ? "secondary" : "primary"}
                                onClick={handleCopyLink}
                                leftIcon={<Copy className="h-4 w-4" />}
                            >
                                {copied ? 'Copied!' : 'Copy'}
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Share via Email
                        </label>
                        <div className="flex space-x-2">
                            <Input
                                type="email"
                                placeholder="Enter email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="flex-1"
                            />
                            <Button
                                onClick={handleEmailShare}
                                disabled={!email}
                                leftIcon={<Mail className="h-4 w-4" />}
                            >
                                Send
                            </Button>
                        </div>
                    </div>

                    <div className="pt-4">
                        <Button
                            variant="secondary"
                            fullWidth
                            leftIcon={<Link className="h-4 w-4" />}
                            onClick={() => {
                                if (navigator.share) {
                                    navigator.share({
                                        title: projectName,
                                        text: `Check out ${projectName} on ProjectNexus`,
                                        url: shareLink,
                                    });
                                }
                            }}
                        >
                            Share via...
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}