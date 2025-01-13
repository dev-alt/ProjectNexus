import React from 'react';

export default function FeaturesPage() {
    return (
        <div className="container mx-auto px-4 py-16">
            <h1 className="text-4xl font-bold text-center mb-8">Our Features</h1>
            <p className="text-lg text-gray-600 text-center mb-12">
                Explore the powerful features that make ProjectNexus the ultimate
                project management solution.
            </p>

            {/* Feature Sections - Add more as needed */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Feature 1 */}
                <div className="p-6 bg-white rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold mb-4">Feature One Title</h2>
                    <p className="text-gray-600">
                        Description of feature one, highlighting its benefits and use
                        cases.
                    </p>
                </div>

                {/* Feature 2 */}
                <div className="p-6 bg-white rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold mb-4">Feature Two Title</h2>
                    <p className="text-gray-600">
                        Description of feature two, highlighting its benefits and use
                        cases.
                    </p>
                </div>

                {/* Feature 3 */}
                <div className="p-6 bg-white rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold mb-4">Feature Three Title</h2>
                    <p className="text-gray-600">
                        Description of feature three, highlighting its benefits and use
                        cases.
                    </p>
                </div>
            </div>
        </div>
    );
}
