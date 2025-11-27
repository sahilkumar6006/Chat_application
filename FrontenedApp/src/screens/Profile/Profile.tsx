/**
 * Profile screen component to display user information
 */
import React, { useState, useEffect } from 'react';
import { View, Image, Alert, TouchableOpacity, Modal } from 'react-native';
import { useTranslation } from 'react-i18next';
import WrapperContainer from '@app/components/WrapperContainer';
import HeaderComp from '@app/components/HeaderComp';
import TextComp from '@app/components/TextComp';
import ButtonComp from '@app/components/ButtonComp';
import { useNavigation } from '@react-navigation/native';
import Routes from '../../navigation/Routes';
import { authService, User } from '@app/services/authService';
import { useRTLStyles } from '@app/hooks';
import { Colors } from '@app/styles';

const Profile = () => {
    const { i18n } = useTranslation();
    const Navigation = useNavigation<any>();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);
    const [showLanguageModal, setShowLanguageModal] = useState(false);

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

    const handleLanguageChange = async (language: string) => {
        try {
            await i18n.changeLanguage(language);
            setShowLanguageModal(false);
            // You might want to persist the language choice here
        } catch (error) {
            console.error('Error changing language:', error);
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

    const styles = useRTLStyles((isRTL, theme, colors) => ({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        headerRight: {
            flexDirection: isRTL ? 'row-reverse' : 'row',
            alignItems: 'center',
            gap: 8,
            paddingRight: isRTL ? 0 : 16,
            paddingLeft: isRTL ? 16 : 0,
        },
        iconWrap: {
            padding: 6,
        },
        icon: {
            fontSize: 24,
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
            backgroundColor: colors.surface,
            borderRadius: 12,
            padding: 20,
            marginBottom: 16,
        },
        infoRow: {
            marginBottom: 16,
            alignItems: isRTL ? 'flex-end' : 'flex-start',
        },
        label: {
            fontSize: 12,
            color: colors.textSecondary,
            marginBottom: 4,
            fontWeight: '600',
            textAlign: isRTL ? 'right' : 'left',
        },
        value: {
            fontSize: 16,
            color: colors.text,
            fontWeight: '500',
            textAlign: isRTL ? 'right' : 'left',
        },
        settingsContainer: {
            width: '100%',
            backgroundColor: colors.surface,
            borderRadius: 12,
            padding: 16,
            marginBottom: 24,
        },
        settingRow: {
            flexDirection: isRTL ? 'row-reverse' : 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 12,
        },
        settingLabel: {
            fontSize: 14,
            color: colors.text,
            fontWeight: '500',
        },
        settingValue: {
            fontSize: 14,
            color: colors.primary,
            fontWeight: '600',
        },
        logoutButton: {
            width: '100%',
        },
        modalBackdrop: {
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.4)',
            alignItems: 'center',
            justifyContent: 'center',
        },
        modalCard: {
            width: '80%',
            backgroundColor: colors.background,
            borderRadius: 10,
            padding: 16,
        },
        modalTitle: {
            fontSize: 18,
            fontWeight: '700',
            marginBottom: 16,
            textAlign: isRTL ? 'right' : 'left',
            color: colors.text,
        },
        modalBtn: {
            backgroundColor: colors.surface,
            padding: 14,
            borderRadius: 8,
            marginVertical: 6,
            flexDirection: isRTL ? 'row-reverse' : 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderWidth: 1,
            borderColor: colors.border,
        },
        modalBtnSelected: {
            backgroundColor: colors.primary,
            borderColor: colors.primary,
        },
        modalBtnText: {
            color: colors.text,
            fontSize: 16,
            fontWeight: '600',
        },
        modalBtnTextSelected: {
            color: '#fff',
        },
        checkmark: {
            color: '#fff',
            fontSize: 18,
            fontWeight: 'bold',
            marginLeft: isRTL ? 0 : 8,
            marginRight: isRTL ? 8 : 0,
        },
    }));

    const currentLanguage = i18n.language === 'ar' ? 'العربية' : 'English';

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
                        <TextComp text={user?.name || 'Loading...'} style={styles.value} isDynamic />
                    </View>

                    <View style={styles.infoRow}>
                        <TextComp text="Email" style={styles.label} />
                        <TextComp text={user?.email || 'Loading...'} style={styles.value} isDynamic />
                    </View>
                </View>

                <View style={styles.settingsContainer}>
                    <TouchableOpacity
                        style={styles.settingRow}
                        onPress={() => setShowLanguageModal(true)}
                        activeOpacity={0.7}
                    >
                        <TextComp text="Language" style={styles.settingLabel} />
                        <TextComp text={currentLanguage} style={styles.settingValue} isDynamic />
                    </TouchableOpacity>
                </View>

                <ButtonComp
                    text="LOGOUT"
                    onPress={handleLogout}
                    isLoading={loading}
                    variant="outline"
                    style={styles.logoutButton}
                />
            </View>

            {/* Language Selection Modal */}
            <Modal
                visible={showLanguageModal}
                transparent
                animationType="fade"
                onRequestClose={() => setShowLanguageModal(false)}
            >
                <TouchableOpacity
                    style={styles.modalBackdrop}
                    activeOpacity={1}
                    onPress={() => setShowLanguageModal(false)}
                >
                    <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
                        <View style={styles.modalCard}>
                            <TextComp text="Select Language" style={styles.modalTitle} />

                            <TouchableOpacity
                                style={[
                                    styles.modalBtn,
                                    i18n.language === 'en' && styles.modalBtnSelected
                                ]}
                                onPress={() => handleLanguageChange('en')}
                            >
                                <TextComp
                                    text="English"
                                    style={[
                                        styles.modalBtnText,
                                        i18n.language === 'en' && styles.modalBtnTextSelected
                                    ]}
                                    isDynamic
                                />
                                {i18n.language === 'en' && (
                                    <TextComp text="✓" style={styles.checkmark} isDynamic />
                                )}
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.modalBtn,
                                    i18n.language === 'ar' && styles.modalBtnSelected
                                ]}
                                onPress={() => handleLanguageChange('ar')}
                            >
                                <TextComp
                                    text="العربية"
                                    style={[
                                        styles.modalBtnText,
                                        i18n.language === 'ar' && styles.modalBtnTextSelected
                                    ]}
                                    isDynamic
                                />
                                {i18n.language === 'ar' && (
                                    <TextComp text="✓" style={styles.checkmark} isDynamic />
                                )}
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>
        </WrapperContainer>
    );
};

export default Profile;
