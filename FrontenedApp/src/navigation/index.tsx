import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ServiceHomeScreen from '@app/screens/ServiceBooking/ServiceHomeScreen';
import ServiceListingScreen from '@app/screens/ServiceBooking/ServiceListingScreen';
import BookingConfirmationScreen from '@app/screens/ServiceBooking/BookingConfirmationScreen';
import Login from '@app/screens/Login/Login';
import Register from '@app/screens/Login/Register';
import Profile from '@app/screens/Profile/Profile';
import Routes from './Routes';
import { AuthStackParamList } from './types';
import { Colors } from '@app/styles/colors';
import { useTheme } from '@app/context/ThemeContext';
import { Chat } from '@app/screens/Chat/Chat';

const Stack = createNativeStackNavigator<AuthStackParamList>();
const Tab = createBottomTabNavigator();

const MainTabs = () => {
    const { theme } = useTheme();

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: Colors[theme].primary,
                tabBarInactiveTintColor: Colors[theme].textSecondary,
                tabBarStyle: {
                    backgroundColor: Colors[theme].surface,
                    borderTopColor: Colors[theme].textSecondary,
                    borderTopWidth: 0.5,
                },
            }}
        >
            <Tab.Screen
                name={Routes.HOME}
                component={ServiceHomeScreen}
                options={{
                    tabBarLabel: 'Home',
                    tabBarIcon: ({ color }) => <></>,
                }}
            />

            <Tab.Screen
                name={Routes.CHAT}
                component={Chat}
                options={{
                    tabBarLabel: 'Chat',
                    tabBarIcon: ({ color }) => <></>,
                }}
            />
            <Tab.Screen
                name={Routes.PROFILE}
                component={Profile}
                options={{
                    tabBarLabel: 'Profile',
                    tabBarIcon: ({ color }) => <></>,
                }}
            />
        </Tab.Navigator>
    );
};

const Navigation = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name={Routes.LOGIN as keyof AuthStackParamList} component={Login} />
                <Stack.Screen name={Routes.REGISTER as keyof AuthStackParamList} component={Register} />
                <Stack.Screen name={Routes.MAIN_TABS as keyof AuthStackParamList} component={MainTabs} />
                <Stack.Screen name={Routes.SERVICE_LISTING as keyof AuthStackParamList} component={ServiceListingScreen} />
                <Stack.Screen name={Routes.BOOKING_CONFIRMATION as keyof AuthStackParamList} component={BookingConfirmationScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default Navigation;
