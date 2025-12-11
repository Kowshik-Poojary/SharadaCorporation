import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { OAuth2Client } from "google-auth-library";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Generate JWT
const generateToken = (user) =>
  jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

/* ------------------------ SIGNUP ------------------------ */
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Account already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });
    const token = generateToken(user);

    res.status(201).json({
      message: "Signup successful",
      token,
      user,
    });
  } catch (err) {
    res.status(500).json({ message: "Signup failed", error: err.message });
  }
});

/* ------------------------ LOGIN ------------------------ */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json({ message: "Account not found. Please Sign Up." });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: "Invalid credentials" });

    const token = generateToken(user);
    res.json({ message: "Login successful", token, user });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
});

/* ------------------------ GOOGLE LOGIN ------------------------ */
router.post("/google-login", async (req, res) => {
  const { credential } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { email } = payload;

    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json({ message: "Account not found. Please Sign Up." });

    const token = generateToken(user);
    res.json({ message: "Google login successful", token, user });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Google login failed", error: err.message });
  }
});

/* ------------------------ GOOGLE SIGNUP ------------------------ */
router.post("/google-signup", async (req, res) => {
  const { credential } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { name, email, picture } = payload;

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Account already exists." });

    const user = await User.create({ name, email, picture, googleUser: true });
    const token = generateToken(user);

    res.status(201).json({
      message: "Google signup successful",
      token,
      user,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Google signup failed", error: err.message });
  }
});

/* ------------------------ FORGOT PASSWORD ------------------------ */
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "No account found." });

    const otp = Math.floor(100000 + Math.random() * 900000);
    user.otp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000; // 5 mins
    await user.save();

    // Send OTP via email
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

    await transporter.sendMail({
      to: email,
      subject: "Password Reset Code",
      text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
    });

    res.json({ message: "OTP sent to your email." });
  } catch (err) {
    res.status(500).json({ message: "Failed to send OTP", error: err.message });
  }
});

/* ------------------------ VERIFY OTP ------------------------ */
router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || user.otp !== otp || user.otpExpiry < Date.now())
      return res.status(400).json({ message: "Invalid or expired OTP." });

    res.json({ message: "OTP verified. Proceed to reset password." });
  } catch (err) {
    res.status(500).json({ message: "OTP verification failed." });
  }
});

/* ------------------------ RESET PASSWORD ------------------------ */
router.post("/reset-password", async (req, res) => {
  const { email, newPassword } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found." });

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    res.json({ message: "Password reset successful." });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Password reset failed.", error: err.message });
  }
});

// POST /api/users/forgot-password
router.post("/api/users/forgot-password", async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const verificationCode = Math.floor(100000 + Math.random() * 900000); // 6-digit code
  user.resetCode = verificationCode;
  user.resetCodeExpiry = Date.now() + 10 * 60 * 1000; // expires in 10 min
  await user.save();

  // Send email
  await sendEmail(
    email,
    "Password Reset Code",
    `Your code is ${verificationCode}`
  );

  res.json({ message: "Verification code sent to your email" });
});

// POST /api/users/reset-password
router.post("/api/users/reset-password", async (req, res) => {
  const { email, code, newPassword } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });
  if (user.resetCode !== code || Date.now() > user.resetCodeExpiry)
    return res.status(400).json({ message: "Invalid or expired code" });

  user.password = newPassword; // hash password before saving in production
  user.resetCode = null;
  user.resetCodeExpiry = null;
  await user.save();

  res.json({ message: "Password reset successful" });
});

export default router;
