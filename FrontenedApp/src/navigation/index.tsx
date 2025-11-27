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
import SplashScreen from '@app/screens/Splash/SplashScreen';
import ChatDetailScreen from '@app/screens/Chat/ChatDetailScreen';
import UserListScreen from '@app/screens/Chat/UserListScreen';
import ReelsScreen from '@app/screens/Reels/ReelsScreen';
import OnBoard from '@app/screens/OnBoard/OnBoard';
import PaymentScreen from '@app/screens/Payment/PaymentScreen';
import Routes from './Routes';
import { AuthStackParamList } from './types';
import { Colors } from '@app/styles/colors';
import { useTheme } from '@app/context/ThemeContext';
import { Chat } from '@app/screens/Chat/Chat';
import { useRTLStyles } from '@app/hooks';

const Stack = createNativeStackNavigator<AuthStackParamList>();
const Tab = createBottomTabNavigator();

const MainTabs = () => {
    const { theme } = useTheme();

    const styles = useRTLStyles((isRTL, theme, themeType) => ({
        tabBarStyle: {
            backgroundColor: Colors[theme].surface,
            borderTopColor: Colors[theme].textSecondary,
            borderTopWidth: 0.5,
        },
        tabBarIconStyle: {
            transform: [
                {
                    rotate: isRTL ? '90deg' : '90deg',
                },
            ],
        },
    }))
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
                    tabBarIconStyle: styles.tabBarIconStyle,
                    tabBarIcon: ({ color }) => <></>,
                }}
            />

            <Tab.Screen
                name={Routes.CHAT}
                component={Chat}
                options={{
                    tabBarLabel: 'Chat',
                    tabBarIconStyle: styles.tabBarIconStyle,
                    tabBarIcon: ({ color }) => <></>,
                }}
            />
            <Tab.Screen
                name={Routes.REELS}
                component={ReelsScreen}
                options={{
                    tabBarLabel: 'Reels',
                    tabBarIconStyle: styles.tabBarIconStyle,
                    tabBarIcon: ({ color }) => <></>,
                }}
            />
            <Tab.Screen
                name={Routes.PROFILE}
                component={Profile}
                options={{
                    tabBarLabel: 'Profile',
                    tabBarIconStyle: styles.tabBarIconStyle,
                    tabBarIcon: ({ color }) => <></>,
                }}
            />
        </Tab.Navigator>
    );
};


const Navigation = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{ headerShown: false }}
                initialRouteName={Routes.SPLASH as keyof AuthStackParamList}
            >
                <Stack.Screen name={Routes.SPLASH as keyof AuthStackParamList} component={SplashScreen} />
                <Stack.Screen name={Routes.ONBOARD as keyof AuthStackParamList} component={OnBoard} />
                <Stack.Screen name={Routes.LOGIN as keyof AuthStackParamList} component={Login} />
                <Stack.Screen name={Routes.REGISTER as keyof AuthStackParamList} component={Register} />
                <Stack.Screen name={Routes.MAIN_TABS as keyof AuthStackParamList} component={MainTabs} />
                <Stack.Screen name={Routes.SERVICE_LISTING as keyof AuthStackParamList} component={ServiceListingScreen} />
                <Stack.Screen name={Routes.BOOKING_CONFIRMATION as keyof AuthStackParamList} component={BookingConfirmationScreen} />
                <Stack.Screen name={Routes.CHAT_DETAIL as keyof AuthStackParamList} component={ChatDetailScreen} />
                <Stack.Screen name={Routes.USER_LIST as keyof AuthStackParamList} component={UserListScreen} />
                <Stack.Screen name={Routes.PAYMENT as keyof AuthStackParamList} component={PaymentScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};



export default Navigation;
