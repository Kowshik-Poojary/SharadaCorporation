import express from "express";
import { sendMail } from "../utils/brevoMailer.js";

const router = express.Router();

/* ---------------- CONTACT US ENQUIRY ---------------- */
router.post("/", async (req, res) => {
  const { name, email, mobile, message } = req.body;

  if (!name || !email || !mobile || !message) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const timestamp = new Date().toISOString();
    await sendMail({
      to: process.env.COMPANY_EMAIL,
      subject: `New Contact Enquiry [${timestamp}]`,
      text: `Name: ${name}
Email: ${email}
Mobile: ${mobile}

Message:
${message}`,
      replyTo: email,
    });

    res.json({ success: true, message: "Enquiry sent successfully!" });
  } catch (err) {
    console.error("Error sending mail:", err);
    res.status(500).json({ success: false, error: "Failed to send enquiry" });
  }
});

/* ---------------- WISHLIST ENQUIRY ---------------- */
router.post("/wishlist", async (req, res) => {
  const { userName, userEmail, selectedItems } = req.body;

  if (!userName || !userEmail || !Array.isArray(selectedItems)) {
    return res.status(400).json({ message: "Invalid wishlist enquiry" });
  }

  let text = `Wishlist Enquiry\n\nName: ${userName}\nEmail: ${userEmail}\n\nProducts:\n`;

  selectedItems.forEach((item, i) => {
    text += `
${i + 1}. ${item.productName}
Variant: ${item.variantCode}
`;
  });

  try {
    const timestamp = new Date().toISOString();
    await sendMail({
      to: process.env.COMPANY_EMAIL,
      subject: `Wishlist Enquiry from ${userName} [${timestamp}]`,
      text,
      replyTo: userEmail,
    });

    res.json({ success: true, message: "Wishlist enquiry sent successfully!" });
  } catch (err) {
    console.error("Wishlist enquiry error:", err);
    res.status(500).json({ success: false, error: "Failed to send wishlist enquiry" });
  }
});

export default router;
