import axios from 'axios';
import { secureStorage } from '@app/utils/secureStorage';

const apiInstance = axios.create({
    baseURL: 'https://api.example.com', // Replace with actual API URL
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiInstance.interceptors.request.use(
    async (config) => {
        const token = await secureStorage.getItem('AUTH_TOKEN');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

apiInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        // Handle global errors (e.g., 401 Unauthorized)
        if (error.response?.status === 401) {
            // Handle logout or token refresh
        }
        return Promise.reject(error);
    }
);

export default apiInstance;
