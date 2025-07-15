import { verifyToken } from "@clerk/backend";

const authUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Missing or malformed token" });
    }

    const token = authHeader.split(" ")[1];

    const payload = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
    });

    // Attach Clerk user ID to request object
    req.clerkID = payload.sub;

    next();
  } catch (error) {
    console.error("Clerk token verification failed:", error);
    res.status(401).json({ error: "Unauthorized" });
  }
};

export default authUser;
