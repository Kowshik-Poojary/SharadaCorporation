import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  productId: { type: String, required: true },
  variantCode: { type: String, required: true },
  addedAt: { type: Date, default: Date.now }
});

export default mongoose.model("Wishlist", wishlistSchema);
