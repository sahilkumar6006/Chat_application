import { combineReducers } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import reducers
import { commonSlice } from '@app/modules/common';
import { cartReducer } from '@app/modules/cart';
import { serviceBookingReducer } from '@app/modules/serviceBooking';

// Persistence configurations
const commonPersistConfig = {
    key: 'commonSlice',
    storage: AsyncStorage,
    blacklist: ['loaders'], // Don't persist loaders
};

const cartPersistConfig = {
    key: 'cartReducer',
    storage: AsyncStorage,
};

const serviceBookingPersistConfig = {
    key: 'serviceBookingReducer',
    storage: AsyncStorage,
    blacklist: ['services'], // Don't persist services list
};

// Combine reducers
const appReducer = combineReducers({
    commonSlice: persistReducer(commonPersistConfig, commonSlice),
    cartReducer: persistReducer(cartPersistConfig, cartReducer),
    serviceBookingReducer: persistReducer(serviceBookingPersistConfig, serviceBookingReducer),
});

// Root reducer with reset capability
const rootReducer = (state: any, action: any) => {
    // Clear state on logout
    if (action.type === 'auth/logout') {
        state = undefined;
    }

    return appReducer(state, action);
};

export default rootReducer;
