// models/Product.js
import mongoose from "mongoose";

const variantSchema = new mongoose.Schema({
  code: { type: String, required: false },               // extracted "Code #"
  data: { type: mongoose.Schema.Types.Mixed },           // all original excel fields
  imageUrl: { type: String },                            // variant-level image (cloudinary)
}, { _id: true });

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  variants: [variantSchema],
  representativeVariant: { type: mongoose.Schema.Types.ObjectId, ref: "Product.variants" },
  description: { type: String },
}, { timestamps: true });

export default mongoose.model("Product", productSchema);
