import axios from "axios";
import fs from "fs";
import FormData from "form-data";
import userModel from "../models/userModel.js";

const removeBgImage = async (req, res) => {
  try {
    const { clerkId } = req.body;

    // 🧭 Validate input
    if (!clerkId) {
      console.log("⚠️ Missing clerkId in request body");
      return res.status(400).json({ error: "Clerk ID is required." });
    }

    // 🔍 Find user
    const user = await userModel.findOne({ clerkID: clerkId });
    if (!user) {
      console.log("⚠️ User not found for clerkId:", clerkId);
      return res.status(404).json({ error: "User not found." });
    }

    // 💳 Check credit balance
    if (user.creditBalance === 0) {
      console.log("🚫 Insufficient credits for user:", user._id);
      return res.status(403).json({
        error: "Insufficient credits.",
        redirect: "/buy", // ✅ Notify frontend to redirect
      });
    }

    // 📁 Validate file
    if (!req.file || !req.file.path) {
      console.log("⚠️ No file received in request.");
      return res.status(400).json({ error: "No image file uploaded." });
    }

    console.log("✅ Received image:", req.file.originalname);
    console.log("🧾 clerkId:", clerkId);

    // 📦 Prepare form data for ClipDrop
    const imageStream = fs.createReadStream(req.file.path);
    const form = new FormData();
    form.append("image_file", imageStream); // ✅ Required field name by ClipDrop

    // 🚀 Call ClipDrop API
    const clipdropRes = await axios.post(
      "https://clipdrop-api.co/remove-background/v1",
      form,
      {
        headers: {
          ...form.getHeaders(),
          "x-api-key": process.env.CLIPDROP_API,
        },
        responseType: "arraybuffer",
      }
    );

    // 🧪 Convert result to base64
    const mimeType = req.file.mimetype || "image/png";
    const base64Image = Buffer.from(clipdropRes.data, "binary").toString("base64");
    const resultImage = `data:${mimeType};base64,${base64Image}`;

    // 💳 Deduct a credit
    await userModel.findByIdAndUpdate(user._id, {
      $inc: { creditBalance: -1 },
    });

    // ✅ Success response
    return res.status(200).json({
      success: true,
      data: resultImage,
      creditBalance: user.creditBalance - 1,
      message: "Background removed successfully",
    });
  } catch (error) {
    console.error("❌ Background removal failed:", error.message);
    return res.status(500).json({ error: "Something went wrong during processing." });
  }
};

export { removeBgImage };
