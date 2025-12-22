// routes/wishlistRoutes.js
import express from "express";
import Wishlist from "../models/Wishlist.js";
import Product from "../models/Product.js";

const router = express.Router();

const normalizeCode = (code) =>
  String(code || "")
    .trim()
    .toLowerCase();


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
  try {
    const wishlist = await Wishlist.find({ userId: req.params.userId });
    const formatted = [];

    for (const item of wishlist) {
      const product = await Product.findById(item.productId);
      if (!product) continue;

      const wantedCode = normalizeCode(item.variantCode);

      const variant = product.variants.find((v) => {
        const variantCode =
          v.code ||
          v.data?.["Code #"] ||
          "";

        return normalizeCode(variantCode) === wantedCode;
      });

      if (!variant) continue;

      formatted.push({
        productId: product._id,
        productName: product.name,
        variantCode:
          variant.code ||
          variant.data?.["Code #"] ||
          item.variantCode,
        imageUrl: variant.imageUrl || variant.data?.imageUrl,
        variantDetails: variant.data,
      });
    }

    // ✅ SORT BY VARIANT CODE
    formatted.sort((a, b) =>
      normalizeCode(a.variantCode).localeCompare(
        normalizeCode(b.variantCode),
        undefined,
        { numeric: true }
      )
    );

    res.json(formatted);
  } catch (err) {
    console.error("Wishlist fetch failed:", err);
    res.status(500).json([]);
  }
});


router.post("/remove", async (req, res) => {
  const { userId, productId, variantCode } = req.body;
  await Wishlist.deleteOne({ userId, productId, variantCode });
  res.json({ success: true });
});

export default router;
