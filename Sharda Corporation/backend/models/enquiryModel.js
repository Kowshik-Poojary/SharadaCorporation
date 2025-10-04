import mongoose from "mongoose";

const enquirySchema = new mongoose.Schema({
  userName: String,
  email: String,
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      sizes: [String],
    },
  ],
  message: String,
});

export default mongoose.model("Enquiry", enquirySchema);
