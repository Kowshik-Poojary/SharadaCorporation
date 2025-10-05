import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { OAuth2Client } from "google-auth-library";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Generate JWT
const generateToken = (user) =>
  jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

/* ------------------------ SIGNUP ------------------------ */
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "User already exists" });

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
    if (!user) return res.status(400).json({ message: "User not found" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: "Invalid credentials" });

    const token = generateToken(user);
    res.json({ message: "Login successful", token, user });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
});

/* ------------------ GOOGLE LOGIN/SIGNUP ------------------ */
router.post("/google", async (req, res) => {
  const { credential } = req.body; // from frontend Google login

  try {
    // Verify Google ID token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { name, email, picture } = payload;

    // Check or create user
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name,
        email,
        picture,
      });
    }

    const token = generateToken(user);

    res.json({
      message: user ? "Login successful" : "Signup successful",
      token,
      user,
    });
  } catch (err) {
    res.status(500).json({
      message: "Google login failed",
      error: err.message,
    });
  }
});

export default router;
