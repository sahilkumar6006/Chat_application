import { Request, Response } from 'express';
import Stripe from 'stripe';

let stripe: Stripe;

const getStripe = () => {
    if (!stripe) {
        stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
            apiVersion: '2025-11-17.clover',
        });
    }
    return stripe;
};

export const createPaymentIntent = async (req: Request, res: Response) => {
    try {
        const { amount, currency = 'usd' } = req.body;

        if (!amount) {
            return res.status(400).json({ error: 'Amount is required' });
        }

        const paymentIntent = await getStripe().paymentIntents.create({
            amount,
            currency,
            automatic_payment_methods: {
                enabled: true,
            },
        });

        res.json({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error: any) {
        console.error('Error creating payment intent:', error);
        res.status(500).json({ error: error.message });
    }
};

export const handlePaymentSuccess = async (req: Request, res: Response) => {
    try {
        const { fcmToken, bookingId } = req.body;

        if (!fcmToken || !bookingId) {
            return res.status(400).json({ error: 'Missing fcmToken or bookingId' });
        }

        const { sendNotification } = require('../services/notificationService');
        await sendNotification(fcmToken, {
            title: 'Payment Successful!',
            body: `Your booking #${bookingId} has been confirmed.`,
            data: { type: 'booking_details', bookingId },
        });

        res.json({ success: true, message: 'Notification sent' });
    } catch (error: any) {
        console.error('Error handling payment success:', error);
        res.status(500).json({ error: error.message });
    }
};
