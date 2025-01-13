// app/(auth)/layout.tsx
'use client';

import React from 'react';
import AuthLoading from '@/components/auth/AuthLoading';
import { useAuthRedirect } from '@/lib/hooks/useAuthRedirect';

export default function AuthLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    // Use the useAuthRedirect hook to handle redirects
    const { loading } = useAuthRedirect();

    // Show loading state while checking auth
    if (loading) {
        return <AuthLoading />;
    }

    // If not logged in, show auth pages (login/register)
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h1 className="text-center text-3xl font-extrabold">
                    ProjectNexus
                </h1>
            </div>
            {children}
        </div>
    );
}
