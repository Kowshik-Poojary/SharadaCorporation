import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  password: String, // empty for Google users
  provider: { type: String, default: "local" }, // 'local' or 'google'
  picture: String,
});

export default mongoose.model("User", userSchema);
