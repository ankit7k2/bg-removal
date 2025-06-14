import { Webhook } from "svix";
import User from "../models/userModels.js";

export const clerkWebhook = async (req, res) => {
  try {
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
    await whook.verify(
      req.body,
      req.headers["svix-id"],
      req.headers["svix-timestamp"],
      req.headers["svix-signature"]
    );

    const { data, type } = req.body;

    switch (type) {
      case "user.created":
        const userData = {
          clerkId: data.id,
          email: data.email_addresses[0].email_address,
          firstName: data.first_name,
          lastName: data.last_name,
          photo: data.profile_image_url,
        };
        await User.create(userData);
        res.status(201).json({ message: "User created" });
        break;

      case "user.updated":
        const updatedUserData = {
          email: data.email_addresses[0].email_address,
          firstName: data.first_name,
          lastName: data.last_name,
          photo: data.profile_image_url,
        };
        await User.findOneAndUpdate({ clerkId: data.id }, updatedUserData);
        res.status(200).json({ message: "User updated" });
        break;

      case "user.deleted":
        await User.findOneAndDelete({ clerkId: data.id });
        res.status(200).json({ message: "User deleted" });
        break;

      default:
        console.log("Unhandled event type:", type);
        res.status(200).json({ message: "Event received" });
    }
  } catch (error) {
    console.error("Webhook verification failed:", error);
    res
      .status(400)
      .json({ error: "Webhook verification failed", details: error.message });
  }
};
