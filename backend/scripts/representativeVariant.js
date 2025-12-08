// scripts/migrate-set-representative.js
import mongoose from "mongoose";
import Product from "../models/Product.js";

const MONGO = process.env.MONGO_URI || "mongodb://localhost:27017/yourdb";

async function main() {
  await mongoose.connect(MONGO);
  const products = await Product.find();
  let updated = 0;

  for (const p of products) {
    if (!p.representativeVariant) {
      // find first variant with image
      const withImage = p.variants.find(v => v.imageUrl && v.imageUrl.trim() !== "");
      if (withImage) p.representativeVariant = withImage._id;
      else if (p.variants.length) p.representativeVariant = p.variants[0]._id;
      else continue; // no variants
      await p.save();
      updated++;
    }
  }

  console.log(`Updated ${updated} products`);
  process.exit(0);
}

main().catch(err => { console.error(err); process.exit(1); });
