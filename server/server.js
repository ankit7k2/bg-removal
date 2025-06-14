import dotenv from "dotenv";
dotenv.config(); // Load environment variables

import express from "express";
import cors from "cors";
import connectDB from "./configs/mongodb.js"; // ✅ Corrected import

const port = process.env.PORT || 4000;
const app = express();

// Define an async function for server setup
const startServer = async () => {
  await connectDB(); // ✅ Ensure MongoDB connects properly

  app.use(express.json());
  app.use(cors());

  app.get("/", (req, res) => {
    res.send("API working!");
  });

  app.listen(port, () => {
    console.log(`🚀 Server is running on port ${port}`);
  });
};

// ✅ Call the function only after it's defined
startServer();
