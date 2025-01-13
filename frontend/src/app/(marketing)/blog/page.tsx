import React from 'react';

export default function BlogPage() {
    return (
        <div className="container mx-auto px-4 py-16">
            <h1 className="text-4xl font-bold text-center mb-8">Our Blog</h1>
            <p className="text-lg text-gray-600 text-center mb-12">
                Latest news, updates, and insights from the ProjectNexus team.
            </p>

            {/* Blog Posts - Ideally fetched from a CMS or API */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Blog Post 1 */}
                <div className="p-6 bg-white rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold mb-2">Blog Post Title 1</h2>
                    <p className="text-gray-600 mb-4">Short excerpt from the post.</p>
                    <a href="#" className="text-blue-600 hover:underline">
                        Read More
                    </a>
                </div>

                {/* Blog Post 2 */}
                <div className="p-6 bg-white rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold mb-2">Blog Post Title 2</h2>
                    <p className="text-gray-600 mb-4">Short excerpt from the post.</p>
                    <a href="#" className="text-blue-600 hover:underline">
                        Read More
                    </a>
                </div>

                {/* Blog Post 3 */}
                <div className="p-6 bg-white rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold mb-2">Blog Post Title 3</h2>
                    <p className="text-gray-600 mb-4">Short excerpt from the post.</p>
                    <a href="#" className="text-blue-600 hover:underline">
                        Read More
                    </a>
                </div>
            </div>
        </div>
    );
}
