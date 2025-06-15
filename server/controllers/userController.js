import { Webhook } from "svix";
import User from "../models/userModel.js"; // adjust path as needed

const clerkWebhooks = async (req, res) => {
  try {
    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    const payload = JSON.stringify(req.body);
    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"]
    };

    const event = wh.verify(payload, headers);
    const { data, type } = event;

    switch (type) {
      case "user.created": {
        const userData = {
          clerkID: data.id,
          email: data.email_addresses?.[0]?.email_address || "",
          photo: data.profile_image_url,
          firstName: data.first_name || "",
          lastName: data.last_name || "",
        };
        await User.create(userData);
        res.json({ status: "user created" });
        break;
      }
      case "user.updated": {
        const updatedUser = {
          email: data.email_addresses?.[0]?.email_address || "",
          photo: data.profile_image_url,
          firstName: data.first_name || "",
          lastName: data.last_name || "",
        };
        await User.findOneAndUpdate(
          { clerkID: data.id },
          updatedUser,
          { new: true, upsert: true }
        );
        res.json({ status: "user updated" });
        break;
      }
      case "user.deleted": {
        await User.findOneAndDelete({ clerkID: data.id });
        res.json({ status: "user deleted" });
        break;
      }
      default:
        console.warn(`Unhandled Clerk webhook type: ${type}`);
        res.status(400).json({ error: "Unhandled event type" });
    }
  } catch (error) {
    console.error("Clerk Webhook Error:", error);
    res.status(500).json({ error: "Webhook processing failed" });
  }
};

export { clerkWebhooks };
