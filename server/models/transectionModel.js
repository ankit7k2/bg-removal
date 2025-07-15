import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    clerkId: { type: String, required: true },
    plan: { type: String, required: true },
    amount: { type: Number, required: true },
    credits: { type: Number, required: true },
    payment: { type: Boolean, default: false },
    receipt: { type: String }, // ✅ Added to match verification
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Transaction =
  mongoose.models.Transaction || mongoose.model("Transaction", transactionSchema);

export default Transaction;
