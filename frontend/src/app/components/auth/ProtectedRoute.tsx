// app/components/auth/ProtectedRoute.tsx
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/auth';
import AuthLoading from './AuthLoading';
import React from "react";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { user, loading } = useAuth();
    const router = useRouter();

    // Show loading state while checking authentication
    if (loading) {
        return <AuthLoading />;
    }

    // If not authenticated, redirect to login
    if (!user) {
        router.push('/login');
        return null;
    }

    // If authenticated, render children
    return <>{children}</>;
};

export default ProtectedRoute;
