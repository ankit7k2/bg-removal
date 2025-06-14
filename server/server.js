import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connectDB from "./configs/mongodb.js";
import userRouter from "./routes/userRoutes.js";

const port = process.env.PORT || 4000;
const app = express();

const startServer = async () => {
  await connectDB();

  // 👇 This must come before express.json() to handle raw webhook body
  app.use("/api/user/webhooks", express.raw({ type: "*/*" }));

  app.use(express.json());
  app.use(cors());

  app.get("/", (req, res) => {
    res.send("API working!");
  });

  app.use("/api/user", userRouter);

  app.listen(port, () => {
    console.log(`🚀 Server is running on port ${port}`);
  });
};

startServer();
