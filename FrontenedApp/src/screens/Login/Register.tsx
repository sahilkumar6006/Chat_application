/**
 * Register screen component for user registration
 */
import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import WrapperContainer from '@app/components/WrapperContainer';
import HeaderComp from '@app/components/HeaderComp';
import TextComp from '@app/components/TextComp';
import TextInputComp from '@app/components/TextInputComp';
import ButtonComp from '@app/components/ButtonComp';
import { useTheme } from '@app/context/ThemeContext';
import useIsRTL from '@app/hooks/useIsRTL';
import { useNavigation } from '@react-navigation/native';
import Routes from '../../navigation/Routes';
import { authService } from '@app/services/authService';
import { StyleSheet } from 'react-native';
import { Colors } from '@app/styles/colors';
import { useTranslation } from 'react-i18next';
import { LangKeys } from '@app/constants/langKeys';

const Register = () => {
    const { theme } = useTheme();
    const isRTL = useIsRTL();
    const Navigation = useNavigation<any>();
    const { t } = useTranslation();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (!name || !email || !password || !confirmPassword) {
            Alert.alert(t(LangKeys.ERROR), 'Please fill in all fields');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert(t(LangKeys.ERROR), 'Passwords do not match');
            return;
        }

        if (password.length < 6) {
            Alert.alert(t(LangKeys.ERROR), 'Password must be at least 6 characters');
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
            <HeaderComp title={t(LangKeys.CREATE_ACCOUNT)} showBack={true} />

            <View style={styles.content}>
                <TextComp text={t(LangKeys.JOIN_US)} style={styles.title} />

                <TextInputComp
                    label={t(LangKeys.NAME)}
                    value={name}
                    onChangeText={setName}
                />

                <TextInputComp
                    label={t(LangKeys.EMAIL)}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                />

                <TextInputComp
                    label={t(LangKeys.PASSWORD)}
                    value={password}
                    onChangeText={setPassword}
                    isPassword
                />

                <TextInputComp
                    label={t(LangKeys.CONFIRM_PASSWORD)}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    isPassword
                />

                <ButtonComp
                    text={t(LangKeys.CREATE_ACCOUNT)}
                    onPress={handleRegister}
                    isLoading={loading}
                    style={{ marginBottom: 16 }}
                />

                <ButtonComp
                    text={t(LangKeys.ALREADY_HAVE_ACCOUNT)}
                    onPress={() => Navigation.navigate(Routes.LOGIN)}
                    variant="outline"
                />
            </View>
        </WrapperContainer>
    );
};

export default Register;
