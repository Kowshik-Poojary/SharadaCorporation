import express from "express";
import Wishlist from "../models/Wishlist.js";

const router = express.Router();

// Add to wishlist
router.post("/add", async (req, res) => {
  console.log("➡ Wishlist Add Request Body:", req.body);
  try {
    const { userId, productId, variantCode } = req.body;
    console.log("➡ Parsed data:", { userId, productId, variantCode });

    const exists = await Wishlist.findOne({ userId, productId, variantCode });
    if (exists) return res.json({ success: true, message: "Already in wishlist" });

    await Wishlist.create({ userId, productId, variantCode });
    console.log("✔ Created Wishlist Item:", productId); 

    res.json({ success: true, message: "Added to wishlist" });
  } catch (err) {
    console.log("❌ SERVER ERROR IN /add:", err);
    res.status(500).json(err);
  }
});

// Get wishlist
router.get("/:userId", async (req, res) => {
  const data = await Wishlist.find({ userId: req.params.userId });
  res.json(data);
});

// Remove wishlist item
router.post("/remove", async (req, res) => {
  const { userId, productId, variantCode } = req.body;
  await Wishlist.deleteOne({ userId, productId, variantCode });
  res.json({ success: true });
});

export default router;
