import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator, LayoutAnimation, Platform, UIManager } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@app/navigation/types';
import ServiceHeader from '@app/components/ServiceHeader';
import ServiceItem from '@app/components/ServiceItem';
import { Colors } from '@app/styles/colors';
import { useTheme } from '@app/context/ThemeContext';
import Routes from '@app/navigation/Routes';
import TextComp from '@app/components/TextComp';
import { TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@app/redux/store';
import { addToCart, removeFromCart } from '@app/modules/cart';
import { selectCartItems } from '@app/modules/cart';
import { bookingService, Service } from '@app/services/bookingService';

if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
}

type ServiceListingRouteProp = RouteProp<AuthStackParamList, 'ServiceListing'>;

const ServiceListingScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
    const route = useRoute<ServiceListingRouteProp>();
    const { theme } = useTheme();
    const colors = Colors[theme];
    const dispatch = useDispatch<AppDispatch>();
    const cartItems = useSelector(selectCartItems);
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);

    // Get categoryId from route params
    const categoryId = (route.params as any)?.categoryId;

    useEffect(() => {
        if (categoryId) {
            loadServices();
        }
    }, [categoryId]);

    useEffect(() => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }, [cartItems.length]);

    const loadServices = async () => {
        try {
            // Use the categoryId from navigation params (MongoDB ObjectId)
            const data = await bookingService.getServices(categoryId);
            setServices(data);
        } catch (error) {
            console.error('Failed to load services', error);
        } finally {
            setLoading(false);
        }
    };

    const getItemQuantity = (id: string): number => {
        return cartItems.find((item: any) => item.id === id)?.quantity || 0;
    };

    const handleIncrement = (item: Service) => {
        dispatch(addToCart({
            id: item.id,
            title: item.title,
            price: item.price,
            description: item.description,
        }));
    };

    const handleDecrement = (id: string) => {
        dispatch(removeFromCart(id));
    };

    const totalItems = cartItems.reduce((sum: number, item: any) => sum + item.quantity, 0);
    const totalPrice = cartItems.reduce((sum: number, item: any) => sum + item.quantity * item.price, 0);

    const handleProceed = () => {
        navigation.navigate(Routes.BOOKING_CONFIRMATION);
    };

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
                title="AC Services"
                subtitle="Select services from our menu"
                showBack
                rightComp={
                    <View style={styles.cartIconContainer}>
                        <TextComp text="🛒" style={{ fontSize: 24, color: colors.text }} />
                        {totalItems > 0 && (
                            <View style={styles.badge}>
                                <TextComp text={totalItems.toString()} style={styles.badgeText} />
                            </View>
                        )}
                    </View>
                }
            />
            <FlatList
                data={services}
                renderItem={({ item }) => (
                    <ServiceItem
                        title={item.title}
                        price={item.price}
                        description={item.description}
                        quantity={getItemQuantity(item.id)}
                        onAdd={() => handleIncrement(item)}
                        onIncrement={() => handleIncrement(item)}
                        onDecrement={() => handleDecrement(item.id)}
                    />
                )}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />
            {totalItems > 0 && (
                <View style={[styles.footer, { backgroundColor: colors.surface }]}>
                    <View>
                        <TextComp text={`${totalItems} service${totalItems > 1 ? 's' : ''} added`} style={{ color: colors.textSecondary, fontSize: 12, marginBottom: 4 }} />
                        <TextComp text={`₹${totalPrice}`} style={{ color: colors.text, fontSize: 20, fontWeight: '800' }} />
                    </View>
                    <TouchableOpacity style={styles.proceedButton} onPress={handleProceed} activeOpacity={0.8}>
                        <TextComp text="Proceed to Book" style={styles.proceedButtonText} />
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    listContent: {
        paddingBottom: 120,
    },
    cartIconContainer: {
        position: 'relative',
        padding: 4,
    },
    badge: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: '#FF3B30',
        borderRadius: 10,
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#FFFFFF',
    },
    badgeText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: 'bold',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.05)',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: 34,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 10,
    },
    proceedButton: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 12,
        shadowColor: '#007AFF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    proceedButtonText: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 16,
    },
});

export default ServiceListingScreen;
