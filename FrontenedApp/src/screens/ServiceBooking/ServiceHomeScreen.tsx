import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Text, Dimensions, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@app/navigation/types';
import ServiceHeader from '@app/components/ServiceHeader';
import ServiceCategoryCard from '@app/components/ServiceCategoryCard';
import { Colors } from '@app/styles/colors';
import { useTheme } from '@app/context/ThemeContext';
import Routes from '@app/navigation/Routes';
import { bookingService, ServiceCategory } from '@app/services/bookingService';

const { width } = Dimensions.get('window');

const ServiceHomeScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
    const { theme } = useTheme();
    const colors = Colors[theme];
    const [categories, setCategories] = useState<ServiceCategory[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            const data = await bookingService.getCategories();
            setCategories(data);
        } catch (error) {
            console.error('Failed to load categories', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryPress = (category: ServiceCategory) => {
        navigation.navigate(Routes.SERVICE_LISTING, { categoryId: category._id } as never);
    };

    const renderHeader = () => (
        <View style={styles.bannerContainer}>
            <View style={[styles.banner, { backgroundColor: '#FF6B6B' }]}>
                {/* Simulated Gradient Effect */}
                <View style={[styles.gradientOverlay, { backgroundColor: '#FF8E53', opacity: 0.6 }]} />

                <View style={styles.bannerContent}>
                    <View>
                        <Text style={styles.bannerTitle}>Winter Chill?</Text>
                        <Text style={styles.bannerSubtitle}>Get Heater Fixed in 30 mins.</Text>
                    </View>
                    <View style={styles.bannerIcon}>
                        <Text style={styles.bannerIconText}>❄️</Text>
                    </View>
                </View>
            </View>
        </View>
    );

    if (loading) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <ServiceHeader
                title="Jammu Services"
                rightComp={
                    <View style={styles.locationContainer}>
                        <Text style={{ color: colors.text, marginRight: 4 }}>📍</Text>
                        <Text style={[styles.locationText, { color: colors.text }]}>Gandhi Nagar</Text>
                    </View>
                }
                titleAlign="left"
                style={styles.header}
            />
            <FlatList
                data={categories}
                renderItem={({ item }) => (
                    <ServiceCategoryCard
                        title={item.title}
                        color={item.color}
                        onPress={() => handleCategoryPress(item)}
                        style={{ width: (width - 48) / 2 }}
                    />
                )}
                keyExtractor={(item) => item.id}
                numColumns={2}
                contentContainerStyle={styles.listContent}
                ListHeaderComponent={renderHeader}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        elevation: 0,
        borderBottomWidth: 0,
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.05)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    locationText: {
        fontWeight: '600',
        fontSize: 12,
    },
    listContent: {
        padding: 16,
    },
    bannerContainer: {
        marginBottom: 24,
        marginTop: 8,
    },
    banner: {
        borderRadius: 20,
        overflow: 'hidden',
        height: 140,
        position: 'relative',
        shadowColor: '#FF6B6B',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },
    gradientOverlay: {
        ...StyleSheet.absoluteFillObject,
        transform: [{ rotate: '45deg' }, { scale: 1.5 }],
    },
    bannerContent: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 24,
    },
    bannerTitle: {
        color: '#FFFFFF',
        fontSize: 24,
        fontWeight: '800',
        marginBottom: 8,
        letterSpacing: 0.5,
    },
    bannerSubtitle: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '500',
        maxWidth: 160,
        lineHeight: 20,
    },
    bannerIcon: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.4)',
    },
    bannerIconText: {
        fontSize: 28,
    },
});

export default ServiceHomeScreen;
