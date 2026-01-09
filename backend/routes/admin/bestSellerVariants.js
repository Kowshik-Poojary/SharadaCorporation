import express from "express";
import BestSellerVariant from "../../models/BestSellerVariant.js";
import Product from "../../models/Product.js";

const router = express.Router();

/* --------------------- GET BEST SELLER VARIANTS (OPTIMIZED) --------------------- */
router.get("/", async (req, res) => {
  try {
    const list = await BestSellerVariant.find()
      .lean() // Use lean() for faster query (read-only)
      .populate("productId", "name category variants _id"); // Only fetch needed fields

    // Batch process without N+1 queries
    const output = list
      .map((item) => {
        const product = item.productId;
        if (!product || !product.variants) return null;

        const variant = product.variants.find(
          (v) => v._id.toString() === item.variantId.toString()
        );

        if (!variant) return null;

        return {
          productId: product._id,
          productName: product.name,
          category: product.category,
          variant
        };
      })
      .filter(Boolean); // Remove null entries

    // Add caching header for 5 minutes
    res.set("Cache-Control", "public, max-age=300");
    res.json(output);
  } catch (error) {
    console.error("Best seller variants error:", error);
    res.status(500).json({ error: "Failed to load best seller variants" });
  }
});

/* --------------------- ADD VARIANT --------------------- */
router.post("/add/:productId/:variantId", async (req, res) => {
  try {
    const exists = await BestSellerVariant.findOne({
      variantId: req.params.variantId
    });

    if (exists)
      return res.status(400).json({ error: "Variant already in best sellers" });

    const added = await BestSellerVariant.create({
      productId: req.params.productId,
      variantId: req.params.variantId
    });

    res.json(added);
  } catch (err) {
    res.status(500).json({ error: "Failed to add variant" });
  }
});

/* --------------------- REMOVE VARIANT --------------------- */
router.delete("/remove/:variantId", async (req, res) => {
  try {
    await BestSellerVariant.findOneAndDelete({
      variantId: req.params.variantId
    });

    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Failed to remove variant" });
  }
});

export default router;
