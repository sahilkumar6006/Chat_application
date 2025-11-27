import React, { useState } from 'react';
import { View, Alert, StyleSheet } from 'react-native';
import { useStripe } from '@stripe/stripe-react-native';
import WrapperContainer from '@app/components/WrapperContainer';
import HeaderComp from '@app/components/HeaderComp';
import ButtonComp from '@app/components/ButtonComp';
import TextComp from '@app/components/TextComp';
import TextInputComp from '@app/components/TextInputComp';
import { useTheme } from '@app/context/ThemeContext';
import { Colors } from '@app/styles/colors';
import { request } from '@app/services/request';

const PaymentScreen = () => {
    const { initPaymentSheet, presentPaymentSheet } = useStripe();
    const { theme } = useTheme();
    const colors = Colors[theme];
    const [loading, setLoading] = useState(false);
    const [amount, setAmount] = useState('1000');

    const fetchPaymentIntentClientSecret = async () => {
        try {
            const response = await request.post('payment/intents', {
                amount: parseInt(amount),
                currency: 'usd',
            });
            return response.data.clientSecret;
        } catch (error) {
            console.error('Error fetching payment intent:', error);
            Alert.alert('Error', 'Failed to fetch payment intent');
            return null;
        }
    };

    const initializePaymentSheet = async () => {
        setLoading(true);
        const clientSecret = await fetchPaymentIntentClientSecret();

        if (!clientSecret) {
            setLoading(false);
            return;
        }

        const { error } = await initPaymentSheet({
            paymentIntentClientSecret: clientSecret,
            merchantDisplayName: 'Chat App',
            returnURL: 'chatapp://payment-complete',
        });

        if (error) {
            Alert.alert('Error', error.message);
            setLoading(false);
        } else {
            openPaymentSheet();
        }
    };

    const openPaymentSheet = async () => {
        const { error } = await presentPaymentSheet();

        if (error) {
            Alert.alert('Error', error.message);
        } else {
            Alert.alert('Success', 'Payment successfully completed!');
        }
        setLoading(false);
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            padding: 20,
        },
        title: {
            fontSize: 20,
            fontWeight: 'bold',
            marginBottom: 20,
            textAlign: 'center',
        },
        input: {
            marginBottom: 20,
        },
    });

    return (
        <WrapperContainer>
            <HeaderComp title="Payment" showBack={true} />
            <View style={styles.container}>
                <TextComp text="Test Stripe Payment" style={styles.title} />

                <TextInputComp
                    label="Amount (in cents)"
                    value={amount}
                    onChangeText={setAmount}
                    keyboardType="numeric"
                    containerStyle={styles.input}
                />

                <ButtonComp
                    text="Pay Now"
                    onPress={initializePaymentSheet}
                    isLoading={loading}
                />
            </View>
        </WrapperContainer>
    );
};

export default PaymentScreen;
