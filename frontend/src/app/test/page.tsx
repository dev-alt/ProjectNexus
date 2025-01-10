'use client'

import { useEffect, useState } from 'react'

export default function TestPage() {
    const [apiStatus, setApiStatus] = useState<string>('Loading...')
    const [testData, setTestData] = useState<any[]>([])

    useEffect(() => {
        // Test health endpoint
        fetch('http://localhost:8085/api/health')
            .then(res => res.json())
            .then(data => setApiStatus(data.message))
            .catch(err => setApiStatus('Error connecting to API'))

        // Test data endpoint
        fetch('http://localhost:8085/api/test')
            .then(res => res.json())
            .then(data => setTestData(data.data))
            .catch(err => console.error('Error fetching test data:', err))
    }, [])

    return (
        <main className="p-8">
            <h1 className="text-2xl font-bold mb-4">API Test Page</h1>

            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-2">API Status:</h2>
                <p className="p-4 bg-gray-100 rounded">{apiStatus}</p>
            </div>

            <div>
                <h2 className="text-xl font-semibold mb-2">Test Data:</h2>
                <div className="grid gap-4">
                    {testData.map(item => (
                        <div key={item.id} className="p-4 bg-gray-100 rounded">
                            <p><strong>ID:</strong> {item.id}</p>
                            <p><strong>Name:</strong> {item.name}</p>
                            <p><strong>Status:</strong> {item.status}</p>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    )
}