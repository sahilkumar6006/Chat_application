import { CartItem } from '@app/redux/slices/cartSlice';
import axios from 'axios';
import { Platform } from 'react-native';
import { secureStorage } from '@app/utils/secureStorage';
import Config from 'react-native-config';


const API_BASE_URL = Config.API_BASE_URL || 'http://192.168.29.51:6000/api';

export interface ServiceCategory {
    _id: string;
    id: string;
    title: string;
    color: string;
}

export interface Service {
    _id: string;
    id: string;
    title: string;
    price: number;
    description: string;
    categoryId: string;
}

export const bookingService = {
    getCategories: async (): Promise<ServiceCategory[]> => {
        try {
            const response = await axios.get<ServiceCategory[]>(`${API_BASE_URL}/service/categories`);
            // Map _id to id for compatibility
            return response.data.map(cat => ({ ...cat, id: cat._id }));
        } catch (error: any) {
            console.error('Error fetching categories:', error);
            throw new Error(error.response?.data?.message || 'Failed to fetch categories');
        }
    },

    getServices: async (categoryId: string): Promise<Service[]> => {
        try {
            const response = await axios.get<Service[]>(`${API_BASE_URL}/service/services/${categoryId}`);
            // Map _id to id for compatibility
            return response.data.map(service => ({ ...service, id: service._id }));
        } catch (error: any) {
            console.error('Error fetching services:', error);
            throw new Error(error.response?.data?.message || 'Failed to fetch services');
        }
    },

    createBooking: async (items: CartItem[], totalAmount: number): Promise<{ success: boolean; bookingId: string }> => {
        try {
            const token = await secureStorage.getItem('authToken');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await axios.post(
                `${API_BASE_URL}/service/bookings`,
                { items, totalAmount },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            return response.data;
        } catch (error: any) {
            console.error('Error creating booking:', error);
            throw new Error(error.response?.data?.message || 'Failed to create booking');
        }
    },
};
