// routes/wishlist.js
import express from "express";
import Wishlist from "../models/Wishlist.js";
import Product from "../models/Product.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

/* ADD ITEM TO WISHLIST */
router.post("/add", async (req, res) => {
  try {
    const { userId, productId, variantCode } = req.body;
    const exists = await Wishlist.findOne({ userId, productId, variantCode });
    if (exists)
      return res.json({ success: true, message: "Already in wishlist" });

    await Wishlist.create({ userId, productId, variantCode });
    res.json({ success: true, message: "Added to wishlist" });
  } catch (err) {
    console.error("❌ /add error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* GET WISHLIST WITH PRODUCT + VARIANT DETAILS */
router.get("/:userId", async (req, res) => {
  try {
    const wishlist = await Wishlist.find({ userId: req.params.userId });
    const formatted = [];

    for (const item of wishlist) {
      const product = await Product.findById(item.productId);
      if (!product) continue;

      const variant = product.variants.find(
        (v) => v.data["Code #"] === item.variantCode
      );
      if (!variant) continue;

      formatted.push({
        productId: product._id.toString(),
        productName: product.name,
        variantCode: item.variantCode,
        imageUrl: variant.imageUrl || variant.data.imageUrl || null,
        variantDetails: variant.data,
      });
    }

    res.json(formatted);
  } catch (err) {
    console.error("❌ /:userId error:", err);
    res.status(500).json({ error: "Server error fetching wishlist" });
  }
});

/* REMOVE FROM WISHLIST */
router.post("/remove", async (req, res) => {
  try {
    const { userId, productId, variantCode } = req.body;
    await Wishlist.deleteOne({ userId, productId, variantCode });
    res.json({ success: true });
  } catch (err) {
    console.error("❌ /remove error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* ENQUIRE — SEND EMAIL THROUGH GMAIL SMTP */
router.post("/enquire", async (req, res) => {
  try {
    const { userName, userEmail, selectedItems } = req.body;

    if (!userName || !userEmail) {
      return res.status(400).json({ error: "Missing user info" });
    }
    if (!Array.isArray(selectedItems) || selectedItems.length === 0) {
      return res.status(400).json({ error: "No items selected" });
    }

    // Build plain text and HTML body
    let textBody = `New Product Enquiry\n\nName: ${userName}\nEmail: ${userEmail}\n\nEnquired Products:\n\n`;
    let htmlBody = `<h2>New Product Enquiry</h2>
      <p><strong>Name:</strong> ${userName}<br/><strong>Email:</strong> ${userEmail}</p>
      <h3>Enquired Products</h3>`;

    selectedItems.forEach((it, idx) => {
      textBody += `Product: ${it.productName}\nVariant Code: ${it.variantCode}\n`;
      htmlBody += `<div style="margin-bottom:16px;border-top:1px solid #eee;padding-top:8px;">
        <strong>#${idx + 1} - ${it.productName}</strong><br/>
        <em>Variant Code: ${it.variantCode}</em><br/>
        <ul>`;
      Object.entries(it.variantDetails || {}).forEach(([k, v]) => {
        textBody += `  - ${k}: ${v}\n`;
        htmlBody += `<li><strong>${k}:</strong> ${v}</li>`;
      });
      textBody += `\n`;
      htmlBody += `</ul></div>`;
    });

    htmlBody += `<p>Regards,<br/>Sharda Corporation</p>`;

    // Configure transporter (Gmail)
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

    // verify transporter (helps debug SMTP auth issues)
    try {
      await transporter.verify();
      console.log("✅ SMTP transporter verified");
    } catch (verifyErr) {
      console.error("❌ SMTP verify error:", verifyErr);
      // don't return here — attempt send to surface real error to frontend
    }

    const mailOptions = {
      from: `"${userName}" <${process.env.EMAIL_USER}>`,
      to: process.env.COMPANY_EMAIL,
      replyTo: userEmail, // company can reply directly to customer
      subject: `Product Enquiry from ${userName}`,
      text: textBody,
      html: htmlBody,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("📧 Enquiry sent:", info.messageId);

    res.json({ success: true, message: "Enquiry email sent successfully" });
  } catch (err) {
    console.error("❌ /enquire error:", err);
    res.status(500).json({ error: "Failed to send enquiry email" });
  }
});

export default router;
