import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { authService } from '@app/services/authService';
import { Colors } from '@app/styles/colors';
import { useTheme } from '@app/context/ThemeContext';
import Routes from '@app/navigation/Routes';
import TextComp from '@app/components/TextComp';
import { LangKeys } from '@app/constants/langKeys';

const SplashScreen = () => {
    const navigation = useNavigation();
    const { theme } = useTheme();
    const colors = Colors[theme];
    const [isChecking, setIsChecking] = useState(true);
    const { t } = useTranslation();

    useEffect(() => {
        checkAuthToken();
    }, []);

    const checkAuthToken = async () => {
        try {
            // Check if user is authenticated
            const user = await authService.getUser();

            // Simulate minimum splash screen time for better UX
            await new Promise(resolve => setTimeout(() => resolve(true), 1500));

            if (user) {
                // User is authenticated, navigate to main tabs
                navigation.reset({
                    index: 0,
                    routes: [{ name: Routes.MAIN_TABS as never }],
                });
            } else {
                // User is not authenticated, navigate to OnBoard
                navigation.reset({
                    index: 0,
                    routes: [{ name: Routes.ONBOARD as never }],
                });
            }
        } catch (error) {
            console.error('Error checking auth token:', error);
            // On error, navigate to OnBoard
            navigation.reset({
                index: 0,
                routes: [{ name: Routes.ONBOARD as never }],
            });
        } finally {
            setIsChecking(false);
        }
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: colors.background,
        },
        logoContainer: {
            marginBottom: 40,
        },
        appName: {
            fontSize: 32,
            fontWeight: 'bold',
            color: colors.primary,
            marginBottom: 8,
        },
        tagline: {
            fontSize: 16,
            color: colors.textSecondary,
            textAlign: 'center',
        },
        loaderContainer: {
            marginTop: 20,
        },
    });

    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <TextComp
                    text={t(LangKeys.APP_NAME)}
                    style={styles.appName}
                    isDynamic
                />
                <TextComp
                    text={t(LangKeys.TAGLINE)}
                    style={styles.tagline}
                    isDynamic
                />
            </View>
            {isChecking && (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            )}
        </View>
    );
};

export default SplashScreen;
