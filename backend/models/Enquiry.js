import mongoose from "mongoose";

const enquirySchema = new mongoose.Schema({
  userId: { type: String, required: true },
  products: [
    {
      productId: { type: String, required: true },
      size: { type: String, required: true }
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

const Enquiry = mongoose.model("Enquiry", enquirySchema);

export default Enquiry;
