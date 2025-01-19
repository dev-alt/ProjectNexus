import React, { useState, useEffect } from 'react';
import { MinusIcon, PlusIcon, RefreshCwIcon } from 'lucide-react';
import type mermaid from 'mermaid';

interface MermaidDiagramProps {
    content: string;
    className?: string;
}

interface Position {
    x: number;
    y: number;
}

const MermaidDiagram: React.FC<MermaidDiagramProps> = ({ content, className = '' }) => {
    const elementRef = React.useRef<HTMLDivElement>(null);
    const containerRef = React.useRef<HTMLDivElement>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<{ message: string; details?: string } | null>(null);
    const [scale, setScale] = useState(1);
    const [isDragging, setIsDragging] = useState(false);
    const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
    const [startPos, setStartPos] = useState<Position>({ x: 0, y: 0 });

    // Handle zoom
    const handleWheel = (e: WheelEvent) => {
        e.preventDefault();
        const delta = e.deltaY * -0.01;
        setScale(prevScale => Math.min(Math.max(0.5, prevScale + delta), 2));
    };

    // Handle pan
    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        setStartPos({ x: e.clientX - position.x, y: e.clientY - position.y });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        setPosition({
            x: e.clientX - startPos.x,
            y: e.clientY - startPos.y
        });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    // Reset view
    const resetView = () => {
        setScale(1);
        setPosition({ x: 0, y: 0 });
    };

    useEffect(() => {
        let unmounted = false;

        const renderDiagram = async (): Promise<void> => {
            if (!elementRef.current) return;

            try {
                setLoading(true);
                setError(null);

                // Clear previous content
                elementRef.current.innerHTML = content;

                // Import and initialize mermaid with retry logic
                const initMermaid = async (retries = 3): Promise<typeof mermaid> => {
                    try {
                        const mermaidModule = await import('mermaid');
                        return mermaidModule.default;
                    } catch (err) {
                        if (retries > 0) {
                            await new Promise(resolve => setTimeout(resolve, 1000));
                            return initMermaid(retries - 1);
                        }
                        throw err;
                    }
                };

                const mermaidInstance = await initMermaid();

                // Initialize mermaid
                mermaidInstance.initialize({
                    theme: 'neutral',
                    fontFamily: 'ui-sans-serif, system-ui',
                    fontSize: 14,
                    themeVariables: {
                        primaryColor: '#3b82f6',
                        primaryTextColor: '#1f2937',
                        lineColor: '#9ca3af',
                        secondaryColor: '#60a5fa'
                    }
                });

                if (!unmounted && elementRef.current) {
                    // Use parsed mermaid instance
                    await mermaidInstance.parse(content);
                    await mermaidInstance.render('mermaid', content);
                    setLoading(false);
                }
            } catch (err) {
                console.error('Mermaid rendering error:', err);
                if (!unmounted) {
                    setError({
                        message: 'Failed to render diagram',
                        details: err instanceof Error ? err.message : String(err)
                    });
                    setLoading(false);
                }
            }
        };

        void renderDiagram();

        // Add zoom event listener
        const container = containerRef.current;
        if (container) {
            container.addEventListener('wheel', handleWheel, { passive: false });
        }

        return () => {
            unmounted = true;
            if (container) {
                container.removeEventListener('wheel', handleWheel);
            }
        };
    }, [content]);

    if (loading) {
        return (
            <div className={`my-4 p-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm ${className}`}>
                <div className="flex flex-col items-center justify-center gap-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                        Rendering diagram...
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={`p-4 text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg ${className}`}>
                <div className="font-medium mb-2">{error.message}</div>
                {error.details && (
                    <div className="text-sm text-red-400 dark:text-red-300 mt-1">
                        {error.details}
                    </div>
                )}
                <pre className="mt-4 p-2 bg-red-100 dark:bg-red-900/40 rounded text-sm overflow-auto">
                    {content}
                </pre>
            </div>
        );
    }

    return (
        <div className={`my-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden ${className}`}>
            {/* Controls */}
            <div className="flex items-center justify-end gap-2 p-2 border-b border-gray-200 dark:border-gray-700">
                <button
                    onClick={() => setScale(s => Math.max(0.5, s - 0.1))}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    title="Zoom out"
                >
                    <MinusIcon className="w-4 h-4" />
                </button>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                    {Math.round(scale * 100)}%
                </span>
                <button
                    onClick={() => setScale(s => Math.min(2, s + 0.1))}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    title="Zoom in"
                >
                    <PlusIcon className="w-4 h-4" />
                </button>
                <button
                    onClick={resetView}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded ml-2"
                    title="Reset view"
                >
                    <RefreshCwIcon className="w-4 h-4" />
                </button>
            </div>

            {/* Diagram Container */}
            <div
                ref={containerRef}
                className="overflow-hidden p-4 cursor-move"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
            >
                <div
                    style={{
                        transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                        transformOrigin: 'center',
                        transition: isDragging ? 'none' : 'transform 0.1s ease-out'
                    }}
                >
                    <div ref={elementRef} className="mermaid flex justify-center">
                        {content}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MermaidDiagram;
