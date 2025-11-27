import { request } from '@app/services/request';
import { API } from '../endpoints';
import {
    IServiceCategory,
    IService,
    ICreateBookingPayload,
    IServiceCategoryResponse,
    IServiceResponse,
    IBookingResponse,
} from './interface';

/**
 * Get all service categories
 */
export const getServiceCategoriesApi = async (): Promise<IServiceCategory[]> => {
    const response = await request.get<IServiceCategory[]>(API.GET_SERVICE_CATEGORIES);
    // Map _id to id for compatibility
    return response.data.map(cat => ({ ...cat, id: cat._id }));
};

/**
 * Get services by category ID
 */
export const getServicesByCategoryApi = async (categoryId: string): Promise<IService[]> => {
    const response = await request.get<IService[]>(`${API.GET_SERVICES_BY_CATEGORY}/${categoryId}`);
    // Map _id to id for compatibility
    return response.data.map(service => ({ ...service, id: service._id }));
};

/**
 * Create a new booking
 */
export const createBookingApi = async (payload: ICreateBookingPayload): Promise<{ success: boolean; bookingId: string }> => {
    const response = await request.post<IBookingResponse>(API.CREATE_BOOKING, payload);
    return {
        success: response.data.success,
        bookingId: response.data.data.bookingId,
    };
};

/**
 * Get user's bookings
 */
export const getUserBookingsApi = async (): Promise<any[]> => {
    const response = await request.get<any>(API.GET_USER_BOOKINGS);
    return response.data.data || [];
};

export * from './interface';
