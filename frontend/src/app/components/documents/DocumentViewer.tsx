import React, {useEffect, useState} from 'react';
import { X, Edit, FileText } from 'lucide-react';
import ReactMarkdown, { Components } from 'react-markdown';
import type { ClassAttributes, HTMLAttributes } from 'react';
import { Document } from '@/types/documents';
import Button from '@/components/ui/Button';

interface DocumentViewerProps {
    document: Document;
    onClose: () => void;
    onEdit: () => void;
}

type MarkdownComponentProps<T extends HTMLElement> = ClassAttributes<T> & HTMLAttributes<T>;

// Mermaid component to handle diagram rendering
const MermaidDiagram: React.FC<{ content: string }> = ({ content }) => {
    const [isClient, setIsClient] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');
    const [svg, setSvg] = useState<string>('');
    const uniqueId = React.useId();

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (!isClient) return;

        let mounted = true;
        const renderDiagram = async () => {
            try {
                setLoading(true);
                setError('');

                // Dynamically import mermaid
                const mermaid = (await import('mermaid')).default;

                mermaid.initialize({
                    startOnLoad: false,
                    theme: 'neutral',
                    securityLevel: 'loose',
                    themeVariables: {
                        fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont',
                        fontSize: '16px',
                        primaryColor: '#3b82f6',
                        primaryTextColor: '#1f2937',
                        primaryBorderColor: '#e5e7eb',
                        lineColor: '#9ca3af',
                        secondaryColor: '#60a5fa',
                        tertiaryColor: '#e5e7eb'
                    }
                });

                const { svg: renderedSvg } = await mermaid.render(
                    `mermaid-${uniqueId}`,
                    content
                );

                if (mounted) {
                    setSvg(renderedSvg);
                    setLoading(false);
                }
            } catch (err) {
                console.error('Mermaid rendering error:', err);
                if (mounted) {
                    setError('Failed to render diagram');
                    setLoading(false);
                }
            }
        };

        renderDiagram().then(r => r);

        return () => {
            mounted = false;
        };
    }, [content, uniqueId, isClient]);

    if (!isClient) {
        return null;
    }

    if (loading) {
        return (
            <div className="my-4 p-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div className="font-medium mb-2">{error}</div>
                <pre className="mt-2 text-sm overflow-auto">{content}</pre>
            </div>
        );
    }

    return (
        <div
            className="my-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-auto p-4"
            dangerouslySetInnerHTML={{ __html: svg }}
        />
    );
};

const DocumentViewer: React.FC<DocumentViewerProps> = ({ document, onClose, onEdit }) => {
    // No need for global mermaid initialization anymore

    // Custom components for markdown rendering
    const components: Components = {
        // Headers (previous code)
        h1: (props: MarkdownComponentProps<HTMLHeadingElement>) => (
            <h1
                {...props}
                className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent mb-6"
            />
        ),
        h2: (props: MarkdownComponentProps<HTMLHeadingElement>) => (
            <h2
                {...props}
                className="text-2xl font-semibold text-blue-500 dark:text-blue-400 mb-4 mt-8"
            />
        ),
        h3: (props: MarkdownComponentProps<HTMLHeadingElement>) => (
            <h3
                {...props}
                className="text-xl font-medium text-gray-800 dark:text-gray-200 mb-3 mt-6"
            />
        ),
        p: (props: MarkdownComponentProps<HTMLParagraphElement>) => (
            <p
                {...props}
                className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4"
            />
        ),
        blockquote: (props: MarkdownComponentProps<HTMLQuoteElement>) => (
            <blockquote
                {...props}
                className="border-l-4 border-blue-500 pl-4 my-4 bg-blue-50/50 dark:bg-blue-900/20 p-4 rounded-r-lg backdrop-blur-sm"
            />
        ),
        ul: (props: MarkdownComponentProps<HTMLUListElement>) => (
            <ul
                {...props}
                className="list-disc list-inside space-y-2 mb-4 ml-4 text-gray-700 dark:text-gray-300"
            />
        ),
        ol: (props: MarkdownComponentProps<HTMLOListElement>) => (
            <ol
                {...props}
                className="list-decimal list-inside space-y-2 mb-4 ml-4 text-gray-700 dark:text-gray-300"
            />
        ),
        // Enhanced code blocks with Mermaid support
        code: (props: MarkdownComponentProps<HTMLElement> & { className?: string; inline?: boolean }) => {
            const match = /language-(\w+)/.exec(props.className || '');
            const isInline = props.inline || !match;

            if (isInline) {
                return (
                    <code
                        {...props}
                        className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded px-2 py-1 font-mono text-sm"
                    />
                );
            }

            // Handle Mermaid diagrams
            if (match && match[1] === 'mermaid' && typeof props.children === 'string') {
                return <MermaidDiagram content={props.children} />;
            }

            // Regular code blocks
            return (
                <div className="relative group">
                    {match && (
                        <div className="absolute -top-3 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-xs text-gray-500 dark:text-gray-400">
                            {match[1]}
                        </div>
                    )}
                    <pre className="mb-4 overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-600">
                        <code
                            {...props}
                            className="block bg-gray-100 dark:bg-gray-900 p-4 text-gray-800 dark:text-gray-200 text-sm font-mono"
                        />
                    </pre>
                </div>
            );
        },
        table: (props: MarkdownComponentProps<HTMLTableElement>) => (
            <div className="overflow-x-auto mb-6">
                <table
                    {...props}
                    className="min-w-full divide-y divide-gray-200 dark:divide-gray-700"
                />
            </div>
        ),
        th: (props: MarkdownComponentProps<HTMLTableCellElement>) => (
            <th
                {...props}
                className="px-6 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            />
        ),
        td: (props: MarkdownComponentProps<HTMLTableCellElement>) => (
            <td
                {...props}
                className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300"
            />
        ),
    };

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-start justify-center pt-16 px-4 z-50 overflow-auto">
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-lg w-full max-w-4xl shadow-2xl border border-white/20 dark:border-gray-700/30">
                {/* Rest of the component remains the same */}
                <div className="flex items-center justify-between p-6 border-b border-white/20 dark:border-gray-700/30 backdrop-blur-md">
                    <div>
                        <h2 className="text-xl font-semibold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
                            {document.title}
                        </h2>
                        <div className="flex items-center gap-2 mt-1 text-sm text-gray-600 dark:text-gray-400">
                            <FileText className="h-4 w-4" />
                            <span>{document.type}</span>
                            <span>•</span>
                            <span>Updated {new Date(document.updatedAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="secondary"
                            onClick={onEdit}
                            leftIcon={<Edit className="h-4 w-4" />}
                            className="backdrop-blur-md bg-white/80 dark:bg-gray-700/80"
                        >
                            Edit
                        </Button>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                <div className="p-8 overflow-auto max-h-[calc(100vh-240px)]">
                    <div className="prose dark:prose-invert max-w-none">
                        <ReactMarkdown components={components}>{document.content}</ReactMarkdown>
                    </div>
                </div>

                <div className="border-t border-white/20 dark:border-gray-700/30 p-4 bg-gray-50/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-b-lg">
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                        <div>
                            Created by <span className="font-medium">{document.author || 'Unknown'}</span>
                        </div>
                        <div>
                            Created on {new Date(document.createdAt).toLocaleDateString()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DocumentViewer;
