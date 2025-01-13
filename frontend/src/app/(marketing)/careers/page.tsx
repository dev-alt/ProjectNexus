import React from 'react';

export default function CareersPage() {
    return (
        <div className="container mx-auto px-4 py-16">
            <h1 className="text-4xl font-bold text-center mb-8">Join Our Team</h1>
            <p className="text-lg text-gray-600 text-center mb-12">
                Explore career opportunities at ProjectNexus and help us shape the
                future of work.
            </p>

            {/* Job Openings */}
            <div className="mb-12">
                <h2 className="text-3xl font-semibold mb-4">Current Openings</h2>
                <ul className="space-y-4">
                    <li>
                        <a href="#" className="text-blue-600 hover:underline">
                            Software Engineer
                        </a>
                    </li>
                    <li>
                        <a href="#" className="text-blue-600 hover:underline">
                            Product Designer
                        </a>
                    </li>
                    <li>
                        <a href="#" className="text-blue-600 hover:underline">
                            Marketing Specialist
                        </a>
                    </li>
                </ul>
            </div>

            {/* Company Culture */}
            <div>
                <h2 className="text-3xl font-semibold mb-4">Our Culture</h2>
                <p className="text-gray-600">
                    Learn about our values, work environment, and what it&#39;s like to be
                    part of the ProjectNexus team.
                </p>
            </div>
        </div>
    );
}
