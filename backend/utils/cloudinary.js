import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import multer from "multer";
import path from "path";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.diskStorage({});
export const upload = multer({ storage });

export const uploadToCloudinary = async (file, options = {}) => {
  const fileName = typeof file === "string" ? path.basename(file) : file.originalname;
  const filePath = typeof file === "string" ? file : file.path;

  // filename without extension
  const publicId = path.parse(fileName).name;
  const folder = options.folder || "Products/Uncategorized";
  const resourceId = `${folder}/${publicId}`;

  try {

    // Check if image already exists
    const existing = await cloudinary.api.resource(resourceId);

    console.log("Already exists");

    return existing;

  } catch (err) {

    // Doesn't exist -> Upload
    return await cloudinary.uploader.upload(filePath, {
      folder,

      public_id: publicId,

      overwrite: false,

      use_filename: true,

      unique_filename: false,

      resource_type: "image",
    });

  }
};