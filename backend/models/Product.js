import mongoose from "mongoose";

const variantSchema = new mongoose.Schema(
  {
    data: { type: mongoose.Schema.Types.Mixed }, 
    // example: { "Code #": "1704-28PG", "Size": "28 oz", "Dia In Cm": "8.5", ... }
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },        // product name
    category: { type: String, required: true },    // sheet name
    variants: [variantSchema],                     // all sizes/types available
    imageUrl: { type: String },                    // cloudinary url (optional)
    description: { type: String },                 // optional
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
