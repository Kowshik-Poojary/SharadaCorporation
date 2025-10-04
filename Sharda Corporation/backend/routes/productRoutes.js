import express from "express";
import Product from "../models/productModel.js";
import { upload } from "../utils/cloudinary.js";

const router = express.Router();

// Upload new product with image
router.post("/add", upload.single("image"), async (req, res) => {
  try {
    const { name, category, sizes, description } = req.body;

    const newProduct = await Product.create({
      name,
      category,
      sizes: JSON.parse(sizes),
      description,
      imageUrl: req.file.path,
    });

    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ message: "Error adding product", error: err });
  }
});

// Get all products
router.get("/", async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});

export default router;
