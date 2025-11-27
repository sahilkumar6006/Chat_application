import express from 'express';
import { createPaymentIntent } from '../controller/PaymentController';

const router = express.Router();

router.post('/intents', createPaymentIntent);

export default router;
