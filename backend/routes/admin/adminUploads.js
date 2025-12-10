import express from "express";
import Product from "../models/Product.js";
import { upload, uploadToCloudinary } from "../utils/cloudinary.js";

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

export default router;
