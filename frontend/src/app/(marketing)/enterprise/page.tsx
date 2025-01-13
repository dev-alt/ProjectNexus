import React from 'react';

export default function EnterprisePage() {
    return (
        <div className="container mx-auto px-4 py-16">
            <h1 className="text-4xl font-bold text-center mb-8">
                Enterprise Solutions
            </h1>
            <p className="text-lg text-gray-600 text-center mb-12">
                ProjectNexus for large organizations. Scalability, security, and
                dedicated support.
            </p>

            {/* Enterprise Features */}
            <div className="mb-12">
                <h2 className="text-3xl font-semibold mb-4">Key Features</h2>
                <ul className="list-disc list-inside">
                    <li>Customizable Workflows</li>
                    <li>Advanced Security</li>
                    <li>Dedicated Account Manager</li>
                    <li>On-Premise Deployment (Optional)</li>
                    <li>And more...</li>
                </ul>
            </div>

            {/* Call to Action */}
            <div className="text-center">
                <button className="bg-blue-600 text-white px-6 py-3 rounded-lg">
                    Contact Sales
                </button>
            </div>
        </div>
    );
}
