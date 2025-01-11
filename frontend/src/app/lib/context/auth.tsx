// app/lib/context/auth.tsx
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { authApi } from '@/lib/api/auth';

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
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for token and validate on mount
        const token = localStorage.getItem('token');
        if (token) {
            authApi.getCurrentUser(token)
                .then(user => setUser(user))
                .catch(() => {
                    localStorage.removeItem('token');
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (email: string, password: string) => {
        const response = await authApi.login({ email, password });
        localStorage.setItem('token', response.token);
        setUser(response.user);
    };

    const register = async (email: string, password: string, name: string) => {
        const response = await authApi.register({ email, password, name });
        localStorage.setItem('token', response.token);
        setUser(response.user);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
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