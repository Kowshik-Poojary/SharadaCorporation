import express from "express";
import Product from "../models/Product.js"; // CORRECT
import Category from "../models/Category.js"; // FIXED PATH

const router = express.Router();

// GET all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// OLD: product-only categories
router.get("/categories/list", async (req, res) => {
  try {
    const categories = await Product.distinct("category");
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// NEW: All categories (Product + Category collection)
router.get("/all/list", async (req, res) => {
  try {
    const productCats = await Product.distinct("category");
    const manualCats = await Category.find().select("name -_id");

    const merged = Array.from(
      new Set([
        ...productCats.map((c) => c?.trim()),
        ...manualCats.map((c) => c.name.trim()),
      ]),
    ).filter(Boolean);

    res.json(merged);
  } catch {
    res.status(500).json({ error: "Failed to load categories" });
  }
});

// GET products in category
router.get("/category/:categoryName", async (req, res) => {
  try {
    // const products = await Product.find({ category: req.params.categoryName });
    // res.json(products);
    const categoryName = req.params.categoryName;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const skip = (page - 1) * limit;

    const filter = {
      category: categoryName,
    };

    const [products, totalProducts] = await Promise.all([
      Product.find(filter).skip(skip).limit(limit).lean(),

      Product.countDocuments(filter),
    ]);

    res.json({
      products,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
      totalProducts,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single product
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
