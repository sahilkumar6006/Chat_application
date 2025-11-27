/**
 * Profile screen component to display user information
 */
import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, Alert } from 'react-native';
import WrapperContainer from '@app/components/WrapperContainer';
import HeaderComp from '@app/components/HeaderComp';
import TextComp from '@app/components/TextComp';
import ButtonComp from '@app/components/ButtonComp';
import { useTheme } from '@app/context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import Routes from '../../navigation/Routes';
import { authService, User } from '@app/services/authService';
import { Colors } from '@app/styles/colors';

const Profile = () => {
    const { theme } = useTheme();
    const Navigation = useNavigation<any>();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        try {
            const userData = await authService.getUserProfile();
            setUser(userData);
        } catch (error) {
            console.error('Error loading user data:', error);
            // Fallback to stored user data if API call fails
            const storedUser = await authService.getUser();
            setUser(storedUser);
        }
    };

    const handleLogout = async () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: async () => {
                        setLoading(true);
                        try {
                            await authService.logout();
                            Navigation.reset({
                                index: 0,
                                routes: [{ name: Routes.LOGIN }],
                            });
                        } catch (error) {
                            console.error('Logout error:', error);
                            Alert.alert('Error', 'Failed to logout');
                        } finally {
                            setLoading(false);
                        }
                    },
                },
            ]
        );
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: Colors[theme].background,
        },
        content: {
            flex: 1,
            padding: 20,
            alignItems: 'center',
        },
        profileImageContainer: {
            marginTop: 20,
            marginBottom: 24,
            alignItems: 'center',
        },
        profileImage: {
            width: 120,
            height: 120,
            borderRadius: 60,
            borderWidth: 3,
            borderColor: Colors[theme].primary,
        },
        infoContainer: {
            width: '100%',
            backgroundColor: Colors[theme].surface,
            borderRadius: 12,
            padding: 20,
            marginBottom: 24,
        },
        infoRow: {
            marginBottom: 16,
        },
        label: {
            fontSize: 12,
            color: Colors[theme].textSecondary,
            marginBottom: 4,
            fontWeight: '600',
        },
        value: {
            fontSize: 16,
            color: Colors[theme].text,
            fontWeight: '500',
        },
        logoutButton: {
            width: '100%',
        },
    });

    return (
        <WrapperContainer style={styles.container}>
            <HeaderComp title="PROFILE" showBack={false} />

            <View style={styles.content}>
                <View style={styles.profileImageContainer}>
                    <Image
                        source={{ uri: user?.image || 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg' }}
                        style={styles.profileImage}
                    />
                </View>

                <View style={styles.infoContainer}>
                    <View style={styles.infoRow}>
                        <TextComp text="Name" style={styles.label} />
                        <TextComp text={user?.name || 'Loading...'} style={styles.value} />
                    </View>

                    <View style={styles.infoRow}>
                        <TextComp text="Email" style={styles.label} />
                        <TextComp text={user?.email || 'Loading...'} style={styles.value} />
                    </View>
                </View>

                <ButtonComp
                    text="LOGOUT"
                    onPress={handleLogout}
                    isLoading={loading}
                    variant="outline"
                    style={styles.logoutButton}
                />
            </View>
        </WrapperContainer>
    );
};

export default Profile;
