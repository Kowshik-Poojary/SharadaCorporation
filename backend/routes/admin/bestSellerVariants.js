import express from "express";
import BestSellerVariant from "../../models/BestSellerVariant.js";
import Product from "../../models/Product.js";

const router = express.Router();

/* --------------------- GET BEST SELLER VARIANTS --------------------- */
router.get("/", async (req, res) => {
  try {
    const list = await BestSellerVariant.find()
      .populate("productId");

    // Attach specific variant inside product
    const output = [];

    for (const item of list) {
      const product = await Product.findById(item.productId);
      const variant = product.variants.id(item.variantId);

      if (variant) {
        output.push({
          productId: product._id,
          productName: product.name,
          category: product.category,
          variant
        });
      }
    }

    res.json(output);
  } catch (error) {
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
