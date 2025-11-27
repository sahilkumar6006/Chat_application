import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { Platform } from 'react-native';
import { secureStorage } from '@app/utils/secureStorage';
import Config from 'react-native-config';


// Base URL configuration

/**
 * Axios instance with interceptors for authentication and error handling
 */
class RequestService {
    private axiosInstance: AxiosInstance;

    constructor() {
        this.axiosInstance = axios.create({
            baseURL: Config.API_BASE_URL || 'http://192.168.0.54:6000/api',
            timeout: 30000,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        this.setupInterceptors();
    }

    private setupInterceptors() {
        // Request interceptor - Add auth token
        this.axiosInstance.interceptors.request.use(
            async (config) => {
                try {
                    const token = await secureStorage.getItem('authToken');
                    if (token && config.headers) {
                        config.headers.Authorization = `Bearer ${token}`;
                    }
                } catch (error) {
                    console.log('Error getting auth token:', error);
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        // Response interceptor - Handle errors
        this.axiosInstance.interceptors.response.use(
            (response) => response,
            async (error) => {
                if (error.response) {
                    // Server responded with error status
                    const { status, data } = error.response;

                    if (status === 401) {
                        // Unauthorized - clear token and redirect to login
                        await secureStorage.removeItem('authToken');
                        // You can dispatch a logout action here if needed
                    }

                    // Return error message from server or default message
                    const errorMessage = data?.message || data?.error || 'An error occurred';
                    return Promise.reject(new Error(errorMessage));
                } else if (error.request) {
                    // Request made but no response
                    return Promise.reject(new Error('Network error. Please check your connection.'));
                } else {
                    // Something else happened
                    return Promise.reject(new Error(error.message || 'An unexpected error occurred'));
                }
            }
        );
    }

    // GET request
    async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return this.axiosInstance.get<T>(url, config);
    }

    // POST request
    async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return this.axiosInstance.post<T>(url, data, config);
    }

    // PUT request
    async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return this.axiosInstance.put<T>(url, data, config);
    }

    // PATCH request
    async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return this.axiosInstance.patch<T>(url, data, config);
    }

    // DELETE request
    async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return this.axiosInstance.delete<T>(url, config);
    }
}

export const request = new RequestService();
export default request;
