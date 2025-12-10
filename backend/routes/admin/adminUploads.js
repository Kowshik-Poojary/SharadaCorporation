import express from "express";
import Product from "../models/Product.js";
import { upload, uploadToCloudinary } from "../utils/cloudinary.js";

const router = express.Router();

/* 
  Upload product images 
  URL: POST /api/admin/uploads/:productId
*/
router.post("/:productId", upload.array("images", 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No images uploaded" });
    }

    // Upload each image to Cloudinary & collect URLs
    const imageUrls = [];

    for (const file of req.files) {
      const uploaded = await uploadToCloudinary(file.path);
      imageUrls.push(uploaded.secure_url);
    }

    // Save first image as representative image (or save array depending on your model)
    const product = await Product.findByIdAndUpdate(
      req.params.productId,
      { $set: { imageUrl: imageUrls[0] } },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({
      message: "Images uploaded successfully",
      imageUrls,
      product
    });

  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
