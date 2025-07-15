// models/userModel.js

import mongoose from "mongoose";

// 🧬 Define the user schema
const userSchema = new mongoose.Schema(
  {
    clerkID: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    photo: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      default: "", // Optional field with default empty string
    },
    lastName: {
      type: String,
      default: "", // Optional field with default empty string
    },
    creditBalance: {
      type: Number,
      default: 5, // Initial credits for new users
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt fields
);

// 📦 Create the model
const User = mongoose.model("User", userSchema);

export default User;
