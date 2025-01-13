import React from 'react';

export default function DocsPage() {
    return (
        <div className="container mx-auto px-4 py-16">
            <h1 className="text-4xl font-bold text-center mb-8">Documentation</h1>
            <p className="text-lg text-gray-600 text-center mb-12">
                Comprehensive guides and documentation to help you get the most out of
                ProjectNexus.
            </p>

            {/* Documentation Topics */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Topic 1 */}
                <div className="p-6 bg-white rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold mb-2">Getting Started</h2>
                    <p className="text-gray-600 mb-4">
                        Learn the basics of setting up your account and creating your first
                        project.
                    </p>
                    <a href="#" className="text-blue-600 hover:underline">
                        Read More
                    </a>
                </div>

                {/* Topic 2 */}
                <div className="p-6 bg-white rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold mb-2">Advanced Features</h2>
                    <p className="text-gray-600 mb-4">
                        Explore in-depth guides on using ProjectNexus&#39;s advanced
                        capabilities.
                    </p>
                    <a href="#" className="text-blue-600 hover:underline">
                        Read More
                    </a>
                </div>

                {/* Topic 3 */}
                <div className="p-6 bg-white rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold mb-2">API Reference</h2>
                    <p className="text-gray-600 mb-4">
                        Detailed documentation for developers integrating with the
                        ProjectNexus API.
                    </p>
                    <a href="#" className="text-blue-600 hover:underline">
                        Read More
                    </a>
                </div>
            </div>
        </div>
    );
}
