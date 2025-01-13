// app/(protected)/layout.tsx
'use client';

import { useAuth } from '@/lib/context/auth';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import MainLayout from '@/components/ui/MainLayout';
import AuthLoading from '@/components/auth/AuthLoading';

export default function ProtectedLayout({
                                            children,
                                        }: Readonly<{
    children: React.ReactNode;
}>) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // If not logged in and not loading, redirect to login page
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    // Show loading state while checking auth
    if (loading) {
        return <AuthLoading />;
    }

    // If logged in, show protected pages with main layout
    if (user) {
        return <MainLayout>{children}</MainLayout>;
    }

    // Return null while redirecting
    return null;
}
