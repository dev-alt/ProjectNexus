import React from 'react';

export default function HelpPage() {
    return (
        <div className="container mx-auto px-4 py-16">
            <h1 className="text-4xl font-bold text-center mb-8">Help Center</h1>
            <p className="text-lg text-gray-600 text-center mb-12">
                Find answers to frequently asked questions, troubleshooting tips, and
                support resources.
            </p>

            {/* FAQ Section */}
            <div className="mb-12">
                <h2 className="text-3xl font-semibold mb-4">Frequently Asked Questions</h2>
                <div className="space-y-4">
                    {/* FAQ 1 */}
                    <details className="p-4 bg-white rounded-lg shadow-md">
                        <summary className="font-semibold cursor-pointer">
                            How do I create a project?
                        </summary>
                        <p className="mt-2 text-gray-600">
                            Detailed steps on creating a new project in ProjectNexus.
                        </p>
                    </details>

                    {/* FAQ 2 */}
                    <details className="p-4 bg-white rounded-lg shadow-md">
                        <summary className="font-semibold cursor-pointer">
                            Can I invite team members?
                        </summary>
                        <p className="mt-2 text-gray-600">
                            Explanation of how to invite and manage team members.
                        </p>
                    </details>

                    {/* Add more FAQs as needed */}
                </div>
            </div>

            {/* Contact Support */}
            <div>
                <h2 className="text-3xl font-semibold mb-4">Contact Support</h2>
                <p className="text-gray-600">
                    If you can&#39;t find the answer you&#39;re looking for, our support team is
                    ready to assist you.
                </p>
                <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg">
                    Contact Support
                </button>
            </div>
        </div>
    );
}
