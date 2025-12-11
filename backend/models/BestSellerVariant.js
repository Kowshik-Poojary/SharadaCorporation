import mongoose from "mongoose";

const bestSellerVariantSchema = new mongoose.Schema({
  variantId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("BestSellerVariant", bestSellerVariantSchema);
