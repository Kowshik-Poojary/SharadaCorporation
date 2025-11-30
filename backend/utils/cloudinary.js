import express from "express";
import Product from "../models/Product.js";
import { upload } from "../utils/cloudinary.js";

const router = express.Router();

// UPLOAD product images
router.post("/:productId", upload.array("images", 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No images uploaded" });
    }

    const imageUrls = req.files.map((file) => file.path);

    const product = await Product.findByIdAndUpdate(
      req.params.productId,
      { $set: { imageUrl: imageUrls[0] } }, // store first image OR replace with array
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({
      message: "Images uploaded successfully",
      imageUrls,
      product,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
