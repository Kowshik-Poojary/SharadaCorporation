// routes/wishlistRoutes.js
import express from "express";
import Wishlist from "../models/Wishlist.js";
import Product from "../models/Product.js";

const router = express.Router();

router.post("/add", async (req, res) => {
  const { userId, productId, variantCode } = req.body;
  if (!userId || !productId || !variantCode) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const exists = await Wishlist.findOne({ userId, productId, variantCode });
  if (!exists) {
    await Wishlist.create({ userId, productId, variantCode });
  }

  res.json({ success: true });
});

router.get("/:userId", async (req, res) => {
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
      productId: product._id,
      productName: product.name,
      variantCode: item.variantCode,
      imageUrl: variant.imageUrl || variant.data.imageUrl,
      variantDetails: variant.data,
    });
  }

  res.json(formatted);
});

router.post("/remove", async (req, res) => {
  const { userId, productId, variantCode } = req.body;
  await Wishlist.deleteOne({ userId, productId, variantCode });
  res.json({ success: true });
});

export default router;
