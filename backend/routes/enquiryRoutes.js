import express from "express";
import nodemailer from "nodemailer";
// ✅ import middleware

const router = express.Router();

// ✅ Protect this route using token verification
router.post("/", async (req, res) => {
  const { name, email, mobile, message } = req.body;

  if (!name || !email || !mobile || !message) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    c; // use this in /routes/wishlist.js and catalogue route
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // SSL
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // App password
      },
      connectionTimeout: 10_000, // 10s
      greetingTimeout: 10_000,
      socketTimeout: 10_000,
    });

    const mailOptions = {
      from: `"Enquiry Form" <shardacorporation.334@gmail.com>`,
      to: "shardacorporation.334@gmail.com",
      subject: "New Enquiry Received",
      text: `You have received a new enquiry.\n\nName: ${name}\nEmail: ${email}\nMobile: ${mobile}\nMessage: ${message}`,
      replyTo: email,
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: "Enquiry sent successfully!" });
  } catch (err) {
    console.error("Error sending mail:", err);
    res.status(500).json({ message: "Failed to send enquiry" });
  }
});

export default router;
