import express from 'express';
import {
  clerkWebhooks,
  userCredits,
  paymentRazorpay,
  verifyRazorpayPayment
} from '../controllers/userController.js';
import authUser from '../middlewares/auth.js';

const userRouter = express.Router();

// 📩 Webhook from Clerk (public route)
userRouter.post('/webhooks', clerkWebhooks);

// 🔐 Credit balance (protected)
userRouter.get('/credits', authUser, userCredits);

// 💳 Razorpay payment and verification (protected)
userRouter.post('/pay-razor', authUser, paymentRazorpay);
userRouter.post('/verify-razor', authUser, verifyRazorpayPayment);

export default userRouter;
