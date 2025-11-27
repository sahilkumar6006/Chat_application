import { AppDispatch } from '@app/redux/store';
import { RootState } from '@app/redux/store';
import { loader } from '@app/modules/common';
import { showToast, showErrorToast, showSuccessToast } from '@app/utils/toast';
import {
    getServiceCategoriesApi,
    getServicesByCategoryApi,
    createBookingApi,
    getUserBookingsApi,
} from '@app/api/serviceBookingApi';
import {
    setCategories,
    setServices,
    setBookings,
    GET_CATEGORIES,
    GET_SERVICES,
    CREATE_BOOKING,
    GET_USER_BOOKINGS,
} from './slice';
import { clearCart } from '@app/modules/cart';

/**
 * Fetch service categories
 */
const getCategories = () => async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
        dispatch(loader.present(GET_CATEGORIES, { global: false }));

        const categories = await getServiceCategoriesApi();
        dispatch(setCategories(categories));

        return categories;
    } catch (error: any) {
        console.log('Error fetching categories:', error);
        showErrorToast(error?.message || 'Failed to load categories');
        dispatch(setCategories([]));
    } finally {
        dispatch(loader.dismiss(GET_CATEGORIES));
    }
};

/**
 * Fetch services by category
 */
const getServicesByCategory = (categoryId: string) => async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
        dispatch(loader.present(GET_SERVICES, { global: false }));

        const services = await getServicesByCategoryApi(categoryId);
        dispatch(setServices(services));

        return services;
    } catch (error: any) {
        console.log('Error fetching services:', error);
        showErrorToast(error?.message || 'Failed to load services');
        dispatch(setServices([]));
    } finally {
        dispatch(loader.dismiss(GET_SERVICES));
    }
};

/**
 * Create a new booking
 */
const createBooking = (items: any[], totalAmount: number) => async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
        dispatch(loader.present(CREATE_BOOKING, { global: true }));

        const result = await createBookingApi({ items, totalAmount });

        if (result.success) {
            showSuccessToast('Booking created successfully!');
            dispatch(clearCart());
            return result;
        }
    } catch (error: any) {
        console.log('Error creating booking:', error);
        showErrorToast(error?.message || 'Failed to create booking');
        throw error;
    } finally {
        dispatch(loader.dismiss(CREATE_BOOKING));
    }
};

/**
 * Get user's bookings
 */
const getUserBookings = () => async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
        dispatch(loader.present(GET_USER_BOOKINGS, { global: false }));

        const bookings = await getUserBookingsApi();
        dispatch(setBookings(bookings));

        return bookings;
    } catch (error: any) {
        console.log('Error fetching user bookings:', error);
        showErrorToast(error?.message || 'Failed to load bookings');
        dispatch(setBookings([]));
    } finally {
        dispatch(loader.dismiss(GET_USER_BOOKINGS));
    }
};

export {
    getCategories,
    getServicesByCategory,
    createBooking,
    getUserBookings,
};
