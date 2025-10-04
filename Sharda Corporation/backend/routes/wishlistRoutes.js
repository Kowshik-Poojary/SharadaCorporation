import express from "express";
import Wishlist from "../models/wishlistModel.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { userId, productId } = req.body;
  const item = await Wishlist.create({ userId, productId });
  res.status(201).json(item);
});

router.get("/:userId", async (req, res) => {
  const items = await Wishlist.find({ userId: req.params.userId }).populate("productId");
  res.json(items);
});

export default router;
