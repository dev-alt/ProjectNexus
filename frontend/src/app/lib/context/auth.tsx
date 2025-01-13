'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api/auth';
import { useToast } from '@/lib/hooks/use-toast';

interface User {
    id: string;
    email: string;
    name: string;
    createdAt: string;
    updatedAt: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, name: string) => Promise<void>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<User | void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const { toast } = useToast();

    // Function to refresh user data and session
    const refreshUser = useCallback(async () => {
        try {
            const userData = await authApi.getCurrentUser();
            setUser(userData);
            return userData;
        } catch {
            setUser(null);
        }
    }, []);

    const login = async (email: string, password: string) => {
        try {
            setLoading(true);
            const response = await authApi.login({ email, password });
            setUser(response.user);
            toast({
                title: 'Success',
                description: 'Successfully logged in',
                variant: 'success',
            });
            router.push('/dashboard');
        } catch (error) {
            toast({
                title: 'Error',
                description:
                    error instanceof Error ? error.message : 'Failed to login',
                variant: 'destructive',
            });
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const register = async (email: string, password: string, name: string) => {
        try {
            setLoading(true);
            const response = await authApi.register({ email, password, name });
            setUser(response.user);
            toast({
                title: 'Success',
                description: 'Successfully registered',
                variant: 'success',
            });
            router.push('/dashboard');
        } catch (error) {
            toast({
                title: 'Error',
                description:
                    error instanceof Error ? error.message : 'Failed to register',
                variant: 'destructive',
            });
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = useCallback(async () => {
        try {
            setLoading(true);
            await authApi.logout();
            setUser(null);
            toast({
                title: 'Success',
                description: 'Successfully logged out',
                variant: 'success',
            });
            router.push('/login');
        } catch (error) {
            toast({
                title: 'Error',
                description:
                    error instanceof Error ? error.message : 'Failed to logout',
                variant: 'destructive',
            });
            throw error;
        } finally {
            setLoading(false);
        }
    }, [router, toast]);

    // Initialize auth state
    useEffect(() => {
        const initAuth = async () => {
            try {
                await refreshUser();
            } finally {
                setLoading(false);
            }
        };

        initAuth().then(r => r);
    }, [refreshUser]);

    // Set up periodic token refresh
    useEffect(() => {
        if (!user) return;

        // Refresh token every 14 minutes (assuming 15-minute expiry)
        const refreshInterval = setInterval(async () => {
            try {
                await authApi.refreshToken();
            } catch (error) {
                console.error('Token refresh failed:', error);
                // Handle failed refresh (e.g., logout)
                await logout();
            }
        }, 14 * 60 * 1000);

        return () => clearInterval(refreshInterval);
    }, [user, logout]); // logout is now safely in the dependency array

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                register,
                logout,
                refreshUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
