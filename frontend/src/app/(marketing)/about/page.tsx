import React from 'react';

export default function AboutPage() {
    return (
        <div className="container mx-auto px-4 py-16">
            <h1 className="text-4xl font-bold text-center mb-8">About Us</h1>
            <p className="text-lg text-gray-600 text-center mb-12">
                Our mission, vision, and the team behind ProjectNexus.
            </p>

            {/* Company Story */}
            <div className="mb-12">
                <h2 className="text-3xl font-semibold mb-4">Our Story</h2>
                <p className="text-gray-600">
                    How we started, our journey, and what drives us.
                </p>
            </div>

            {/* Team Section */}
            <div>
                <h2 className="text-3xl font-semibold mb-4">Meet the Team</h2>
                {/* Add team member profiles here */}
            </div>
        </div>
    );
}
