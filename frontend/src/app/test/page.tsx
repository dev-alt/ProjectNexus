'use client';

import { useEffect, useState } from 'react';

// Define a type for the test data items
interface TestDataItem {
    id: number;
    name: string;
    status: string;
}

export default function TestPage() {
    const [apiStatus, setApiStatus] = useState<string>('Loading...');
    const [testData, setTestData] = useState<TestDataItem[]>([]);
    const [testDataError, setTestDataError] = useState<string | null>(null); // State for handling test data errors

    useEffect(() => {
        // Test health endpoint
        fetch('http://localhost:8085/api/health')
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`API health check failed with status: ${res.status}`);
                }
                return res.json();
            })
            .then((data) => setApiStatus(data.message))
            .catch((err) => {
                console.error('Error testing API health:', err);
                setApiStatus('Error connecting to API');
            });

        // Test data endpoint
        fetch('http://localhost:8085/api/test')
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`API test data fetch failed with status: ${res.status}`);
                }
                return res.json();
            })
            .then((data) => {
                if (!Array.isArray(data.data)) {
                    throw new Error('Invalid data format received from API');
                }
                setTestData(data.data);
                setTestDataError(null); // Clear any previous errors
            })
            .catch((err) => {
                console.error('Error fetching test data:', err);
                setTestDataError('Error fetching test data. Check console for details.'); // Set error message
            });
    }, []);

    return (
        <main className="p-8">
            <h1 className="text-2xl font-bold mb-4">API Test Page</h1>

            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-2">API Status:</h2>
                <p className="p-4 bg-gray-100 rounded">{apiStatus}</p>
            </div>

            <div>
                <h2 className="text-xl font-semibold mb-2">Test Data:</h2>
                {/* Conditionally render error or data */}
                {testDataError ? (
                    <p className="p-4 bg-red-100 text-red-800 rounded">{testDataError}</p>
                ) : (
                    <div className="grid gap-4">
                        {testData.map((item) => (
                            <div key={item.id} className="p-4 bg-gray-100 rounded">
                                <p>
                                    <strong>ID:</strong> {item.id}
                                </p>
                                <p>
                                    <strong>Name:</strong> {item.name}
                                </p>
                                <p>
                                    <strong>Status:</strong> {item.status}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}