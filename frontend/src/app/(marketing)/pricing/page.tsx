import React from 'react';

export default function PricingPage() {
    return (
        <div className="container mx-auto px-4 py-16">
            <h1 className="text-4xl font-bold text-center mb-8">Pricing Plans</h1>
            <p className="text-lg text-gray-600 text-center mb-12">
                Choose the plan that best fits your team&#39;s needs and budget.
            </p>

            {/* Pricing Tiers - Add more as needed */}
            <div className="grid md:grid-cols-3 gap-8">
                {/* Tier 1 */}
                <div className="p-6 bg-white rounded-lg shadow-md border border-blue-600">
                    <h2 className="text-2xl font-semibold mb-2">Free</h2>
                    <p className="text-gray-600 mb-4">For individuals and small teams.</p>
                    <p className="text-4xl font-bold mb-4">$0/month</p>
                    <ul className="mb-6">
                        <li>Feature 1</li>
                        <li>Feature 2</li>
                        <li>Feature 3</li>
                    </ul>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
                        Get Started
                    </button>
                </div>

                {/* Tier 2 */}
                <div className="p-6 bg-white rounded-lg shadow-md border border-green-600">
                    <h2 className="text-2xl font-semibold mb-2">Pro</h2>
                    <p className="text-gray-600 mb-4">For growing teams.</p>
                    <p className="text-4xl font-bold mb-4">$29/month</p>
                    <ul className="mb-6">
                        <li>All Free features</li>
                        <li>Feature 4</li>
                        <li>Feature 5</li>
                    </ul>
                    <button className="bg-green-600 text-white px-4 py-2 rounded-lg">
                        Try Pro
                    </button>
                </div>

                {/* Tier 3 */}
                <div className="p-6 bg-white rounded-lg shadow-md border border-purple-600">
                    <h2 className="text-2xl font-semibold mb-2">Enterprise</h2>
                    <p className="text-gray-600 mb-4">For large organizations.</p>
                    <p className="text-xl font-bold mb-4">Contact Us</p>
                    <ul className="mb-6">
                        <li>All Pro features</li>
                        <li>Feature 6</li>
                        <li>Feature 7</li>
                    </ul>
                    <button className="bg-purple-600 text-white px-4 py-2 rounded-lg">
                        Contact Sales
                    </button>
                </div>
            </div>
        </div>
    );
}
