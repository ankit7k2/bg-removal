// middlewares/multer.js

import multer from "multer";
import fs from "fs";
import path from "path";

// Use Vercel-compatible writable directory
const uploadDir = path.join("/tmp", "uploads");

// Ensure the /tmp/uploads directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("📁 Created /tmp/uploads directory");
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

export default upload;
