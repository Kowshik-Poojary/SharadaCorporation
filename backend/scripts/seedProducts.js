import mongoose from "mongoose";
import Product from "../models/Product.js";
import fs from "fs";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the correct .env in backend/
const envPath = path.resolve(__dirname, "../.env");
console.log("Loading .env from:", envPath);

dotenv.config({ path: envPath });
console.log("MONGO_URI =", process.env.MONGO_URI); // debug

async function main() {
  if (!process.env.MONGO_URI) {
    console.error("❌ ERROR: MONGO_URI is missing from .env file!");
    process.exit(1);
  }

  const jsonPath = process.argv[2] || "products_cleaned.json";
  const data = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));

  await mongoose.connect(process.env.MONGO_URI);
  console.log("🔗 Connected to MongoDB");

  await Product.deleteMany({});
  console.log("🧹 Cleared existing products");

  await Product.insertMany(data);
  console.log(`✅ Inserted ${data.length} products`);

  process.exit(0);
}

main();
