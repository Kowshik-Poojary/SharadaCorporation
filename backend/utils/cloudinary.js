import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import multer from "multer";

dotenv.config();

/* -------------------- CLOUDINARY CONFIG -------------------- */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/* -------------------- MULTER (for file reading) -------------------- */
const storage = multer.diskStorage({});
export const upload = multer({ storage });

/* -------------------- UPLOAD FUNCTION -------------------- */
export const uploadToCloudinary = async (filePath) => {
  return cloudinary.uploader.upload(filePath, {
    folder: "sharda/products",
    resource_type: "image",
  });
};
