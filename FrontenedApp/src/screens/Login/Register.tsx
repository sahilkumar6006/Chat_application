/**
 * Register screen component for user registration
 */
import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import WrapperContainer from '@/components/WrapperContainer';
import HeaderComp from '@/components/HeaderComp';
import TextComp from '@/components/TextComp';
import TextInputComp from '@/components/TextInputComp';
import ButtonComp from '@/components/ButtonComp';
import { useTheme } from '@/context/ThemeContext';
import useIsRTL from '@/hooks/useIsRTL';
import { useNavigation } from '@react-navigation/native';
import Routes from '../../navigation/Routes';
import { authService } from '@/services/authService';
import { StyleSheet } from 'react-native';
import { Colors } from '@/styles/colors';

const Register = () => {
    const { theme } = useTheme();
    const isRTL = useIsRTL();
    const Navigation = useNavigation<any>();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (!name || !email || !password || !confirmPassword) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        if (password.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        try {
            const user = await authService.register({ name, email, password });
            console.log('Registration successful:', user);

            Alert.alert(
                'Success',
                'Account created successfully! Please login.',
                [
                    {
                        text: 'OK',
                        onPress: () => Navigation.navigate(Routes.LOGIN),
                    },
                ]
            );
        } catch (error: any) {
            console.error('Registration error:', error);
            Alert.alert('Registration Failed', error.message || 'Could not create account');
        } finally {
            setLoading(false);
        }
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: Colors[theme].background,
        },
        content: {
            flex: 1,
            padding: 20,
        },
        title: {
            fontSize: 24,
            fontWeight: 'bold',
            marginBottom: 24,
            color: Colors[theme].text,
        },
    });

    return (
        <WrapperContainer style={styles.container}>
            <HeaderComp title="CREATE ACCOUNT" showBack={true} />

            <View style={styles.content}>
                <TextComp text="Join us today" style={styles.title} />

                <TextInputComp
                    label="NAME"
                    value={name}
                    onChangeText={setName}
                />

                <TextInputComp
                    label="EMAIL"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                />

                <TextInputComp
                    label="PASSWORD"
                    value={password}
                    onChangeText={setPassword}
                    isPassword
                />

                <TextInputComp
                    label="CONFIRM PASSWORD"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    isPassword
                />

                <ButtonComp
                    text="CREATE ACCOUNT"
                    onPress={handleRegister}
                    isLoading={loading}
                    style={{ marginBottom: 16 }}
                />

                <ButtonComp
                    text="Already have an account? Login"
                    onPress={() => Navigation.navigate(Routes.LOGIN)}
                    variant="outline"
                />
            </View>
        </WrapperContainer>
    );
};

export default Register;
