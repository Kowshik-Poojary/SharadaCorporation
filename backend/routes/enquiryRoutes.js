import express from "express";
import nodemailer from "nodemailer";

const router = express.Router();

router.post("/", async (req, res) => {
  const { name, email, mobile, message } = req.body;

  if (!name || !email || !mobile || !message) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Gmail transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // use STARTTLS
      auth: {
        user: "shardacorporation.334@gmail.com", // sender Gmail
        pass: process.env.EMAIL_PASS, // 16-digit Gmail App Password
      },
    });

    // Mail options
    const mailOptions = {
      from: `"Enquiry Form" <shardacorporation.334@gmail.com>`,
      to: "shardacorporation.334@gmail.com", // Admin inbox
      subject: "New Enquiry Received",
      text: `You have received a new enquiry.\n\nName: ${name}\nEmail: ${email}\nMobile: ${mobile}\nMessage: ${message}`,
      replyTo: email, // reply directly to user
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: "Enquiry sent successfully!" });
  } catch (err) {
    console.error("Error sending mail:", err);
    res.status(500).json({ message: "Failed to send enquiry" });
  }
});

export default router;
