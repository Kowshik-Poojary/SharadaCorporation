import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import Product from "./models/Product.js";  // adjust path

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// local images root folder
const ROOT = "./images";

async function uploadImage(localPath, cloudFolder, publicId) {
  try {
    const result = await cloudinary.uploader.upload(localPath, {
      folder: cloudFolder,
      public_id: publicId,
      overwrite: true
    });

    return result.secure_url;
  } catch (err) {
    console.error("❌ Upload Failed:", localPath, err.message);
    return null;
  }
}

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("🔗 Connected to MongoDB");

  // list category folders inside /images
  const categories = fs.readdirSync(ROOT);

  for (const category of categories) {
    const categoryPath = path.join(ROOT, category);
    if (!fs.lstatSync(categoryPath).isDirectory()) continue;

    console.log(`\n📁 Category: ${category}`);

    const files = fs.readdirSync(categoryPath);

    for (const file of files) {
      if (!file.toLowerCase().endsWith(".jpg")) continue;

      const code = path.parse(file).name.trim();
      const localFilePath = path.join(categoryPath, file);

      console.log(`⬆ Uploading: ${category}/${file}`);

      // Cloudinary path: sharda/variants/<Category>/<code>.jpg
      const cloudFolder = `sharda/variants/${category}`;

      const imageUrl = await uploadImage(localFilePath, cloudFolder, code);
      if (!imageUrl) continue;

      // Find matching product+variant
      const product = await Product.findOne({
        category: category,
        "variants.data": {
          $elemMatch: {
            $or: [
              { code: code },
              { "Code": code },
              { "Code #": code },
              { "Item Code": code }
            ]
          }
        }
      });

      if (!product) {
        console.log(`⚠ No matching product found for ${code} in ${category}`);
        continue;
      }

      // Update variant
      let updated = false;

      product.variants.forEach((v) => {
        for (const key of Object.keys(v.data)) {
          if (v.data[key] === code) {
            v.data.imageUrl = imageUrl; // store cloudinary URL
            updated = true;
          }
        }
      });

      if (updated) {
        await product.save();
        console.log(`✅ Updated: ${code}`);
      } else {
        console.log(`⚠ Variant found but code not matched for ${code}`);
      }
    }
  }

  console.log("\n🎉 All category images processed!");
  process.exit(0);
}

main();
