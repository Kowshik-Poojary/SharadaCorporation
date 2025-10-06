import express from "express";
import nodemailer from "nodemailer";

const router = express.Router();

router.post("/request", async (req, res) => {
  const { userEmail } = req.body;

  if (!userEmail) {
    return res.status(400).json({ message: "User email missing" });
  }

  try {
    // Transporter setup (use your app Gmail)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "shardacorporation334@gmail.com", // sender Gmail
        pass: process.env.EMAIL_PASS, // App password from Google
      },
    });

    // Mail options
    const mailOptions = {
      from: `"Catalogue Request" <shardacorporation334@gmail.com>`,
      to: "shardacorporation334@gmail.com", // receiver (your main inbox)
      subject: "New Catalogue Request",
      text: `A user has requested the catalogue.\n\nUser Email: ${userEmail}`,
      replyTo: userEmail, // allows you to reply directly to the user
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: "Catalogue request sent successfully!" });
  } catch (err) {
    console.error("Error sending mail:", err);
    res.status(500).json({ message: "Failed to send email" });
  }
});

export default router;
