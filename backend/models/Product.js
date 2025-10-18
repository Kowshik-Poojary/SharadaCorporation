import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  sizes: [{ type: String }], // e.g., ["Small", "Medium", "Large"]
  imageUrl: { type: String, required: true }, // URL from Cloudinary
});

const Product = mongoose.model("Product", productSchema);

export default Product;
