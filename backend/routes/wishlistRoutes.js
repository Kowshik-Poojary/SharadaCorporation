import express from "express";
import Wishlist from "../models/Wishlist.js";
import Product from "../models/Product.js";


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
// Get wishlist with product + variant details
router.get("/:userId", async (req, res) => {
  try {
    const wishlist = await Wishlist.find({ userId: req.params.userId });

    const formatted = [];

    for (const item of wishlist) {
      const product = await Product.findById(item.productId);

      if (!product) continue;

      // find the matching variant
      const variant = product.variants.find(
        (v) => v.data["Code #"] === item.variantCode
      );

      if (!variant) continue;

      formatted.push({
        productId: product._id,
        productName: product.name,
        variantCode: item.variantCode,
        imageUrl: variant.imageUrl || variant.data.imageUrl || "",
        variantDetails: variant.data, // all fields from Excel
      });
    }

    res.json(formatted);
  } catch (err) {
    console.log("❌ Wishlist Fetch Error:", err);
    res.status(500).json({ error: "Server error fetching wishlist" });
  }
});


// Remove wishlist item
router.post("/remove", async (req, res) => {
  const { userId, productId, variantCode } = req.body;
  await Wishlist.deleteOne({ userId, productId, variantCode });
  res.json({ success: true });
});

export default router;
