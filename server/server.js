import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import connectDB from "./configs/mongodb.js";
import userRouter from "./routes/userRouter.js";
import imageRouter from "./routes/imageRouter.js";

const app = express();
const PORT = process.env.PORT || 4000;

// 🌐 Global Middleware
app.use(cors());
app.use(express.json());

// 🔎 Health Check
app.get("/", (req, res) => {
  res.send("✅ Background Removal API is running!");
});

// 🛠 API Routes
app.use("/api/user", userRouter);
app.use("/api/image", imageRouter);

// 🚀 Start Server
const startServer = async () => {
  try {
    await connectDB();
    console.log("✅ MongoDB connected");
    console.log("🔍 Connection state:", mongoose.connection.readyState); // should be 1

    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

startServer();
