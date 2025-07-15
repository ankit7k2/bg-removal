// routes/imageRouter.js

import express from "express";
import { removeBgImage } from "../controllers/imageController.js";
import upload from "../middlewares/multer.js";
import authUser from "../middlewares/auth.js";

const imageRouter = express.Router();

imageRouter.post(
  "/remove-bg",
  authUser,
  upload.single("image_file"), // ✅ field must match frontend & controller
  removeBgImage
);

export default imageRouter;
