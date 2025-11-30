import mongoose from "mongoose";
import Product from "../models/Product.js";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

async function main() {
  const jsonPath = process.argv[2] || "products.json";
  const data = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));

  await mongoose.connect(process.env.MONGO_URI);
  console.log("🔗 Connected to MongoDB");

  await Product.deleteMany({});
  console.log("🧹 Cleared existing products");

  for (const product of data) {
    await Product.create(product);
  }

  console.log(`✅ Inserted ${data.length} products`);
  process.exit(0);
}

main();
