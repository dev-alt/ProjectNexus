// lib/hooks/useAuthRedirect.ts
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/context/auth';

export const useAuthRedirect = (
    redirectToIfAuth: string = '/dashboard',
    redirectToIfNoAuth: string = '/login'
) => {
    const { user, loading } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (loading) return;

        if (user) {
            // If user is authenticated, redirect to dashboard or callback URL
            const callbackUrl = searchParams?.get('callbackUrl') || redirectToIfAuth;
            router.push(callbackUrl);
        } else {
            // If no user and not on auth page, redirect to login
            if (!window.location.pathname.startsWith('/login') &&
                !window.location.pathname.startsWith('/register')) {
                const currentPath = window.location.pathname;
                router.push(`${redirectToIfNoAuth}?callbackUrl=${encodeURIComponent(currentPath)}`);
            }
        }
    }, [user, loading, router, searchParams, redirectToIfAuth, redirectToIfNoAuth]);

    return { user, loading };
};
