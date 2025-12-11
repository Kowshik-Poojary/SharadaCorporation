import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },

  imageUrl: { type: String, default: "" },

  link: { type: String, default: "" }, 
  // example → "/products/catalogue/New Arrivals"

  position: { type: Number, default: 0 } // for slider order
});

export default mongoose.model("Category", categorySchema);
