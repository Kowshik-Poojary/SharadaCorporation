import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // make optional for Google users
  picture: { type: String },
  googleUser: { type: Boolean, default: false },
  otp: Number,
  otpExpiry: Date,
});

const User = mongoose.model("User", userSchema);

export default User;
