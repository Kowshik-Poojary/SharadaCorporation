// routes/adminProducts.js
import express from "express";
import Product from "../models/Product.js";
const router = express.Router();

/* ----------------- PRODUCT CRUD ----------------- */
// create
router.post("/products", async (req, res) => {
  try {
    const p = await Product.create(req.body);
    // set representativeVariant after creation if variants exist
    if (!p.representativeVariant && p.variants.length) {
      p.representativeVariant = p.variants[0]._id;
      await p.save();
    }
    res.json(p);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// update product (name/category/description)
router.put("/products/:id", async (req, res) => {
  try {
    const p = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(p);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// delete product
router.delete("/products/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

/* ----------------- VARIANT CRUD ----------------- */
// add variant
router.post("/products/:id/variants", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    product.variants.push(req.body);
    await product.save();
    // ensure representativeVariant set
    if (!product.representativeVariant) {
      product.representativeVariant = product.variants[0]._id;
      await product.save();
    }
    res.json(product);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// update variant
router.put("/products/:id/variants/:variantId", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    const variant = product.variants.id(req.params.variantId);
    if (!variant) return res.status(404).json({ message: "Variant not found" });
    // update fields (code, data, imageUrl)
    variant.set(req.body);
    await product.save();
    res.json(product);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// delete variant
router.delete("/products/:id/variants/:variantId", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    const vid = req.params.variantId;
    // remove variant
    product.variants = product.variants.filter(v => String(v._id) !== String(vid));

    // if representative pointed to deleted variant -> choose fallback
    if (product.representativeVariant && String(product.representativeVariant) === String(vid)) {
      const fallback = product.variants.find(v => v.imageUrl && v.imageUrl.trim() !== "") || product.variants[0];
      product.representativeVariant = fallback ? fallback._id : undefined;
    }

    await product.save();
    res.json(product);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

/* ----------------- REPRESENTATIVE VARIANT ----------------- */
// set representative
router.put("/products/:productId/representative/:variantId", async (req, res) => {
  try {
    const { productId, variantId } = req.params;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });
    const variant = product.variants.id(variantId);
    if (!variant) return res.status(404).json({ message: "Variant not found" });
    product.representativeVariant = variant._id;
    await product.save();
    res.json(product);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

export default router;
