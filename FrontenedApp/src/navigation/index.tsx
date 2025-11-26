import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ServiceHomeScreen from '@/screens/ServiceBooking/ServiceHomeScreen';
import ServiceListingScreen from '@/screens/ServiceBooking/ServiceListingScreen';
import BookingConfirmationScreen from '@/screens/ServiceBooking/BookingConfirmationScreen';
import Login from '@/screens/Login/Login';
import Routes from './Routes';
import { AuthStackParamList } from './types';

const Stack = createNativeStackNavigator<AuthStackParamList>();

const Navigation = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name={Routes.LOGIN as keyof AuthStackParamList} component={Login} />
                <Stack.Screen name={Routes.SERVICE_HOME as keyof AuthStackParamList} component={ServiceHomeScreen} />
                <Stack.Screen name={Routes.SERVICE_LISTING as keyof AuthStackParamList} component={ServiceListingScreen} />
                <Stack.Screen name={Routes.BOOKING_CONFIRMATION as keyof AuthStackParamList} component={BookingConfirmationScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default Navigation;
