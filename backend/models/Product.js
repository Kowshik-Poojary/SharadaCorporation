// models/Product.js
import mongoose from "mongoose";

/* ========= NEW VARIANT SCHEMA ========= */
const variantSchema = new mongoose.Schema(
  {
    code: { type: String, required: false }, // NEW FIELD
    data: { type: mongoose.Schema.Types.Mixed }, // EXISTING EXCEL FIELDS
    imageUrl: { type: String }, // NEW FIELD (clean image URL)
  },
  { _id: true },
);

/* ========= PRODUCT SCHEMA ========= */
const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    variants: [variantSchema],
    representativeVariant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product.variants",
    },
    description: { type: String },
  },
  { timestamps: true },
);

productSchema.index({
  category: 1,
});

export default mongoose.model("Product", productSchema);
