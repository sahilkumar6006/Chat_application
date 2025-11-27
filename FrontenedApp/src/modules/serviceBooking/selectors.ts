import type { RootState } from '@app/redux/store';

export const selectCategories = (state: RootState) => state.serviceBookingReducer.categories;

export const selectServices = (state: RootState) => state.serviceBookingReducer.services;

export const selectSelectedCategory = (state: RootState) => state.serviceBookingReducer.selectedCategory;

export const selectBookings = (state: RootState) => state.serviceBookingReducer.bookings;
