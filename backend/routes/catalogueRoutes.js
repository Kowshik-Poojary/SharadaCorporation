import express from "express";
import { sendMail } from "../utils/brevoMailer.js";

const router = express.Router();

router.post("/request", async (req, res) => {
  const { userEmail } = req.body;

  if (!userEmail) {
    return res.status(400).json({ message: "User email missing" });
  }

  try {
    const timestamp = new Date().toISOString();
    await sendMail({
      to: process.env.COMPANY_EMAIL,
      subject: `New Catalogue Request [${timestamp}]`,
      text: `A user has requested the catalogue.\n\nUser Email: ${userEmail}`,
      replyTo: userEmail,
    });

    res.json({ success: true, message: "Catalogue request sent successfully!" });
  } catch (err) {
    console.error("Error sending mail:", err);
    res.status(500).json({ success: false, error: "Failed to send email" });
  }
});

export default router;
