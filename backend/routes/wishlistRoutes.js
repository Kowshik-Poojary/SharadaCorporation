import express from "express";
import Wishlist from "../models/Wishlist.js"; // Create schema for Wishlist

const router = express.Router();

// POST to add product to wishlist
router.post("/", async (req, res) => {
  try {
    const { userId, productId } = req.body;
    const wishlist = new Wishlist({ userId, productId });
    await wishlist.save();
    res.json({ message: "Added to wishlist" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
