import express from 'express';
import { createPaymentIntent, handlePaymentSuccess } from '../controller/PaymentController';

const router = express.Router();

router.post('/intents', createPaymentIntent);
router.post('/success', handlePaymentSuccess);

export default router;
