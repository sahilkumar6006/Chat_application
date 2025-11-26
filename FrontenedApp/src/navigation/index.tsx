import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '@/screens/Login/Login';
import Routes from './Routes';
import { AuthStackParamList } from './types';

const Stack = createNativeStackNavigator<AuthStackParamList>();

const Navigation = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name={Routes.LOGIN as keyof AuthStackParamList} component={Login} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default Navigation;
