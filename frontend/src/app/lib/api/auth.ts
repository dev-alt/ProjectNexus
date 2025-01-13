// app/lib/api/auth.ts
interface LoginCredentials {
    email: string;
    password: string;
}

interface RegisterData extends LoginCredentials {
    name: string;
}

interface AuthResponse {
    token: string;
    user: {
        id: string;
        email: string;
        name: string;
        createdAt: string;
        updatedAt: string;
    };
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8085';

export const authApi = {
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const response = await fetch(`${API_URL}/v1/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to login');
        }

        return response.json();
    },

    async register(data: RegisterData): Promise<AuthResponse> {
        const response = await fetch(`${API_URL}/v1/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to register');
        }

        return response.json();
    },

    async getCurrentUser(): Promise<AuthResponse['user']> {
        const response = await fetch(`${API_URL}/v1/users/me`, {
            credentials: 'include', // Important for cookies
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to get user');
        }

        return response.json();
    },

    async logout(): Promise<void> {
        const response = await fetch(`${API_URL}/v1/auth/logout`, {
            method: 'POST',
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to logout');
        }
    },

    async refreshToken(): Promise<AuthResponse> {
        const response = await fetch(`${API_URL}/v1/auth/refresh`, {
            method: 'POST',
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to refresh token');
        }

        return response.json();
    }
};
