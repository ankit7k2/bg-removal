import { Webhook } from "svix";
import User from "../models/userModel.js";
import Razorpay from "razorpay";
import Transaction from "../models/transectionModel.js";

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET_KEY,
});

const clerkWebhooks = async (req, res) => { /* unchanged */ };
const userCredits = async (req, res) => { /* unchanged */ };

const paymentRazorpay = async (req, res) => {
  try {
    const { clerkID, planId } = req.body;
    if (!clerkID || !planId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const user = await User.findOne({ clerkID });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    let credits, plan, amount;
    switch (planId) {
      case "Basic":
        credits = 100; plan = "Basic Plan"; amount = 10 * 100; break;
      case "Advanced":
        credits = 500; plan = "Advanced Plan"; amount = 50 * 100; break;
      case "Business":
        credits = 5000; plan = "Business Plan"; amount = 250 * 100; break;
      default:
        return res.status(400).json({ error: "Invalid plan ID" });
    }

    const receiptId = `receipt_${Date.now()}`;
    const order = await razorpayInstance.orders.create({
      amount,
      currency: process.env.CURRENCY || "INR",
      receipt: receiptId,
    });

    await Transaction.create({
      clerkId: clerkID,
      plan,
      amount,
      credits,
      receipt: receiptId, // ✅ save receipt
      payment: false,
      date: new Date(),
    });

    res.status(201).json({
      success: true,
      order,
      planDetails: { credits, plan },
    });
  } catch (error) {
    console.error("❌ Razorpay Order Error:", error);
    res.status(500).json({ error: "Order creation failed" });
  }
};

const verifyRazorpayPayment = async (req, res) => {
  try {
    const { razorpay_order_id, clerkID, receipt } = req.body;

    if (!razorpay_order_id || !clerkID || !receipt) {
      return res.status(400).json({ error: "Missing verification fields" });
    }

    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);
    if (orderInfo.status !== "paid") {
      return res.status(400).json({ success: false, message: "Payment not completed" });
    }

    const transaction = await Transaction.findOne({
      clerkId: clerkID,
      receipt,
      payment: false,
    });

    if (!transaction) {
      return res.status(404).json({ success: false, message: "Transaction not found" });
    }

    const user = await User.findOne({ clerkID });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.creditBalance += transaction.credits;
    await user.save();

    transaction.payment = true;
    await transaction.save();

    res.json({ success: true, message: "Payment verified and credits added" });
  } catch (error) {
    console.error("❌ Verification Error:", error);
    res.status(500).json({ error: "Payment verification failed" });
  }
};

export { clerkWebhooks, userCredits, paymentRazorpay, verifyRazorpayPayment };
