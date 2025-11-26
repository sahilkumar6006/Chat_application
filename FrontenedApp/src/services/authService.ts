import axios from 'axios';
import { secureStorage } from '@/utils/secureStorage';
import { Platform } from 'react-native';


const URL = Platform.OS === 'ios' ? 'http://localhost:6000/api' : 'http://192.168.0.54:6000/api';

export const API_BASE_URL = URL;

export interface User {
    _id: string;
    name: string;
    email: string;
    image?: string;
}

export interface AuthResponse {
    user: User;
    token: string;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
}

export interface LoginData {
    email: string;
    password: string;
}

export const authService = {
    /**
     * Register a new user
     */
    register: async (data: RegisterData): Promise<User> => {
        try {
            const response = await axios.post<User>(`${API_BASE_URL}/user`, data);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Registration failed');
        }
    },

    /**
     * Login user and store token
     */
    login: async (data: LoginData): Promise<AuthResponse> => {
        try {
            const response = await axios.post<AuthResponse>(`${API_BASE_URL}/user/auth`, data);
            const { token, user } = response.data;

            // Store token in secure storage
            await secureStorage.setItem('authToken', token);
            await secureStorage.setItem('user', JSON.stringify(user));

            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Login failed');
        }
    },

    /**
     * Logout user and clear stored data
     */
    logout: async (): Promise<void> => {
        await secureStorage.removeItem('authToken');
        await secureStorage.removeItem('user');
    },

    /**
     * Get stored auth token
     */
    getToken: async (): Promise<string | null> => {
        return await secureStorage.getItem('authToken');
    },

    /**
     * Get stored user data
     */
    getUser: async (): Promise<User | null> => {
        const userStr = await secureStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    /**
   * Fetch user profile from backend
   */
    getUserProfile: async (): Promise<User> => {
        try {
            const token = await secureStorage.getItem('authToken');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await axios.get<User>(`${API_BASE_URL}/user/profile`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Update stored user data
            await secureStorage.setItem('user', JSON.stringify(response.data));

            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Failed to fetch profile');
        }
    },

    /**
     * Check if user is authenticated
     */
    isAuthenticated: async (): Promise<boolean> => {
        const token = await secureStorage.getItem('authToken');
        return !!token;
    },
};
