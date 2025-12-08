import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "../models/Product.js";

dotenv.config();

async function migrate() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");

  const products = await Product.find({});
  console.log(`Found ${products.length} products`);

  for (const product of products) {
    let updated = false;

    product.variants = product.variants.map(variant => {
      const newVariant = variant;

      // 1. Extract CODE
      const code = variant.data?.["Code #"];
      if (code) {
        newVariant.code = code;   // NEW FIELD
      }

      // 2. Extract IMAGE URL
      const imgUrl = variant.data?.imageUrl;
      if (imgUrl) {
        newVariant.imageUrl = imgUrl; // NEW FIELD
      }

      // 3. Remove imageUrl from variant.data
      if (newVariant.data?.imageUrl) {
        delete newVariant.data.imageUrl;
      }

      updated = true;
      return newVariant;
    });

    if (updated) {
      await product.save();
      console.log(`Migrated product → ${product.name}`);
    }
  }

  console.log("🎉 Migration Completed Successfully!");
  process.exit(0);
}

migrate().catch(err => {
  console.error("Migration Error:", err);
  process.exit(1);
});
