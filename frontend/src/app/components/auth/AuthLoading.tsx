// app/components/auth/AuthLoading.tsx
import React from 'react';
import { Loader2 } from 'lucide-react';

const AuthLoading = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto" />
                <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                    Loading your account...
                </p>
            </div>
        </div>
    );
};

export default AuthLoading;

