import express from "express";
import Product from "../models/Product.js";
import { upload, uploadToCloudinary } from "../utils/cloudinary.js";
import Category from "../../models/Category.js";

const router = express.Router();

/* 
  Upload product images inside a folder named by category
  URL: POST /api/admin/uploads/:productId
*/
router.post("/:productId", upload.array("images", 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No images uploaded" });
    }

    // Get product to know its category
    const product = await Product.findById(req.params.productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const categoryFolder = product.category.replace(/\s+/g, "_");

    // Upload each image to Cloudinary in a category-based folder
    const imageUrls = [];

    for (const file of req.files) {
      const uploaded = await uploadToCloudinary(file.path, {
        folder: `Products/${categoryFolder}`,   // ⭐ Category folder here
      });

      imageUrls.push(uploaded.secure_url);
    }

    // Save first image as representative product image
    const updated = await Product.findByIdAndUpdate(
      req.params.productId,
      { $set: { imageUrl: imageUrls[0] } },
      { new: true }
    );

    res.json({
      message: `Images uploaded to folder Products/${categoryFolder}`,
      folder: `Products/${categoryFolder}`,
      imageUrls,
      product: updated,
    });

  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: error.message });
  }
});

/* ---------------- CREATE CATEGORY ---------------- */
router.post("/", async (req, res) => {
  try {
    const name = req.body.name.trim();
    const linkName = name.replace(/\s+/g, "-").toLowerCase();

    const category = await Category.create({
      name,
      link: `/products/catalogue/${name}`,
      position: 0
    });

    res.json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ---------------- UPLOAD CATEGORY IMAGE ---------------- */
router.post(
  "/:categoryId/image",
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) return res.status(400).json({ error: "No file" });

      const uploaded = await uploadToCloudinary(req.file.path, {
        folder: "Categories",
      });

      const updated = await Category.findByIdAndUpdate(
        req.params.categoryId,
        { imageUrl: uploaded.secure_url },
        { new: true }
      );

      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

/* ---------------- GET ALL CATEGORIES ---------------- */
router.get("/all", async (req, res) => {
  const list = await Category.find().sort({ position: 1 });
  res.json(list);
});

export default router;
