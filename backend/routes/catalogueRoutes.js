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
    // use this in /routes/wishlist.js and catalogue route
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

    // Mail options
    const mailOptions = {
      from: `"Catalogue Request" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: "New Catalogue Request",
      text: `A user has requested the catalogue.\n\nUser Email: ${userEmail}`,
      replyTo: userEmail,
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: "Catalogue request sent successfully!" });
  } catch (err) {
    console.error("Error sending mail:", err);
    res.status(500).json({ message: "Failed to send email" });
  }
});

export default router;
