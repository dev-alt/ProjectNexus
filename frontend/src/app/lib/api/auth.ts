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

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8085/api';

export const authApi = {
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const response = await fetch(`${API_URL}/auth/login`, {
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

        const data = await response.json();
        localStorage.setItem('token', data.token);
        return data;
    },

    async register(data: RegisterData): Promise<AuthResponse> {
        const response = await fetch(`${API_URL}/auth/register`, {
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

        const responseData = await response.json();
        localStorage.setItem('token', responseData.token);
        return responseData;
    },

    async getCurrentUser(): Promise<AuthResponse['user']> {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/users/me`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to get user');
        }

        return response.json();
    },

    async logout(): Promise<void> {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/auth/logout`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to logout');
            }
        } finally {
            localStorage.removeItem('token');
        }
    },

    async refreshToken(): Promise<AuthResponse> {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/auth/refresh`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to refresh token');
        }

        const data = await response.json();
        localStorage.setItem('token', data.token);
        return data;
    }
};
