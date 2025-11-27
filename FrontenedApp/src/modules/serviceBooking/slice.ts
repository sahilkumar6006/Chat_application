import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IServiceCategory, IService, IBooking } from '@app/api/serviceBookingApi';

interface IServiceBookingState {
    categories: IServiceCategory[];
    services: IService[];
    selectedCategory: IServiceCategory | null;
    bookings: IBooking[];
}

const initialState: IServiceBookingState = {
    categories: [],
    services: [],
    selectedCategory: null,
    bookings: [],
};

const slice = createSlice({
    name: 'serviceBooking',
    initialState,
    reducers: {
        setCategories(state, action: PayloadAction<IServiceCategory[]>) {
            state.categories = action.payload;
        },
        setServices(state, action: PayloadAction<IService[]>) {
            state.services = action.payload;
        },
        setSelectedCategory(state, action: PayloadAction<IServiceCategory | null>) {
            state.selectedCategory = action.payload;
        },
        setBookings(state, action: PayloadAction<IBooking[]>) {
            state.bookings = action.payload;
        },
        clearServiceBookingData(state) {
            state.categories = [];
            state.services = [];
            state.selectedCategory = null;
            state.bookings = [];
        },
    },
});

export default slice.reducer;
export const {
    setCategories,
    setServices,
    setSelectedCategory,
    setBookings,
    clearServiceBookingData,
} = slice.actions;

// Action type constants for loaders
export const GET_CATEGORIES = 'GET_CATEGORIES';
export const GET_SERVICES = 'GET_SERVICES';
export const CREATE_BOOKING = 'CREATE_BOOKING';
export const GET_USER_BOOKINGS = 'GET_USER_BOOKINGS';
