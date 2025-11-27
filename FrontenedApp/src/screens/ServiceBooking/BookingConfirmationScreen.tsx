import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ServiceHeader from '@app/components/ServiceHeader';
import BookingSummaryCard from '@app/components/BookingSummaryCard';
import { Colors } from '@app/styles/colors';
import { useTheme } from '@app/context/ThemeContext';
import TextComp from '@app/components/TextComp';
import { useAppSelector, useAppDispatch } from '@app/redux/hooks';
import { bookingService } from '@app/services/bookingService';
import { clearCart } from '@app/redux/slices/cartSlice';
import Routes from '@app/navigation/Routes';

const BookingConfirmationScreen = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const colors = Colors[theme];
  const dispatch = useAppDispatch();
  const [isUrgent, setIsUrgent] = useState(false);
  const [loading, setLoading] = useState(false);
  const cartItems = useAppSelector(state => state.cart.items);

  const serviceTotal = cartItems.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0,
  );
  const urgentCharge = isUrgent ? 50 : 0;
  const finalTotal = serviceTotal + urgentCharge;
  const bookingItems = [
    { label: 'Service Charge', value: serviceTotal },
    ...(isUrgent ? [{ label: 'Urgent Service Fee', value: urgentCharge }] : []),
    { label: 'Total Amount', value: finalTotal, isTotal: true },
  ];

  const handleBookService = async () => {
    setLoading(true);
    try {
      const result = await bookingService.createBooking(cartItems, finalTotal);
      if (result.success) {
        Alert.alert(
          'Booking Confirmed!',
          `Your booking ID is ${result.bookingId}`,
          [
            {
              text: 'OK',
              onPress: () => {
                dispatch(clearCart());
                navigation.navigate(Routes.MAIN_TABS as never);
              },
            },
          ],
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to book service. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ServiceHeader
        title="Confirm Booking"
        subtitle="Gandhi Nagar, Jammu"
        showBack
      />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Urgent Service Card */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.surface,
              borderColor: isUrgent ? '#34C759' : 'transparent',
              borderWidth: 1,
            },
          ]}
        >
          <View style={styles.cardHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TextComp text="🕒" style={{ fontSize: 24, marginRight: 12 }} />
              <View>
                <TextComp text="Need it in 60 mins?" style={styles.cardTitle} />
                <TextComp
                  text="Get priority service for just ₹50 extra"
                  style={{ color: colors.textSecondary, fontSize: 12 }}
                />
              </View>
            </View>
            <Switch
              value={isUrgent}
              onValueChange={setIsUrgent}
              trackColor={{ false: '#767577', true: '#34C759' }}
              thumbColor={'#FFFFFF'}
              ios_backgroundColor="#3e3e3e"
            />
          </View>
        </View>

        {/* Selected Services Card */}
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <TextComp text="Selected Services" style={styles.sectionTitle} />
          {cartItems.map(item => (
            <View key={item.id} style={styles.serviceRow}>
              <View style={{ flex: 1 }}>
                <TextComp text={item.title} style={styles.serviceName} />
                <TextComp
                  text={`Qty: ${item.quantity}`}
                  style={{
                    color: colors.textSecondary,
                    fontSize: 12,
                    marginTop: 2,
                  }}
                />
              </View>
              <TextComp
                text={`₹${item.price * item.quantity}`}
                style={styles.servicePrice}
              />
            </View>
          ))}
          {cartItems.length === 0 && (
            <TextComp
              text="No services selected"
              style={{ color: colors.textSecondary, fontStyle: 'italic' }}
            />
          )}
        </View>

        {/* Service Details Card */}
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <TextComp text="Service Details" style={styles.sectionTitle} />
          <View style={styles.detailRow}>
            <TextComp
              text="Standard Time"
              style={{ color: colors.textSecondary }}
            />
            <TextComp text="2-3 hours" style={{ fontWeight: '600' }} />
          </View>
          <View style={[styles.detailRow, { borderBottomWidth: 0 }]}>
            <TextComp text="Warranty" style={{ color: colors.textSecondary }} />
            <TextComp text="30 days" style={{ fontWeight: '600' }} />
          </View>
        </View>

        {/* Price Breakdown */}
        <BookingSummaryCard items={bookingItems} />

        {/* Urgent Service Banner */}
        <View style={styles.urgentBanner}>
          <TextComp
            text="💡 Activate urgent service to get help faster"
            style={{ color: '#007AFF', fontWeight: '500' }}
          />
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={[styles.footer, { backgroundColor: colors.surface }]}>
        <View>
          <TextComp
            text="Total Amount"
            style={{
              color: colors.textSecondary,
              fontSize: 12,
              marginBottom: 4,
            }}
          />
          <TextComp
            text={`₹${finalTotal}`}
            style={{ color: colors.text, fontSize: 20, fontWeight: '800' }}
          />
        </View>
        <TouchableOpacity
          style={[
            styles.bookButton,
            { opacity: loading || cartItems.length === 0 ? 0.7 : 1 },
          ]}
          onPress={handleBookService}
          disabled={loading || cartItems.length === 0}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <TextComp text="Book Service" style={styles.bookButtonText} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 120,
  },
  card: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 16,
    letterSpacing: 0.3,
  },
  serviceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  serviceName: {
    fontSize: 14,
    fontWeight: '600',
  },
  servicePrice: {
    fontSize: 14,
    fontWeight: '700',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  urgentBanner: {
    backgroundColor: '#E5F2FF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#CCE4FF',
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
  bookButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
    minWidth: 160,
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
});

export default BookingConfirmationScreen;
