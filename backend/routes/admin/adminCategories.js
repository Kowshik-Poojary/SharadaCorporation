import express from "express";
import Category from "../../models/Category.js";
import Product from "../../models/Product.js";

const router = express.Router();

/* ==========================================================
    IMPORTANT: MERGED CATEGORY LIST FOR DROPDOWNS
    MUST BE ABOVE ALL OTHER GET ROUTES
   ========================================================== */
router.get("/all/list", async (req, res) => {
  try {
    // categories used inside product documents
    const productCats = await Product.distinct("category");

    // categories saved manually in Category collection
    const manualCats = await Category.find().select("name -_id");

    const merged = Array.from(
      new Set([
        ...productCats.map((c) => c?.trim()),
        ...manualCats.map((c) => c.name.trim()),
      ])
    )
      .filter(Boolean)
      .sort();

    res.json(merged);
  } catch (err) {
    res.status(500).json({ error: "Failed to load categories" });
  }
});

/* ==========================================================
    GET ALL CATEGORIES WITH PRODUCT COUNT (AdminCategories Page)
   ========================================================== */
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find();

    const result = await Promise.all(
      categories.map(async (c) => ({
        _id: c._id,
        name: c.name,
        productCount: await Product.countDocuments({ category: c.name }),
      }))
    );

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Failed to load categories" });
  }
});

/* ------------------ ADD CATEGORY ------------------ */
router.post("/", async (req, res) => {
  try {
    const name = req.body.name?.trim();
    if (!name) return res.status(400).json({ error: "Name required" });

    const exists = await Category.findOne({ name });
    if (exists) return res.status(400).json({ error: "Category exists" });

    const cat = await Category.create({ name });
    res.json(cat);
  } catch {
    res.status(500).json({ error: "Failed to add category" });
  }
});

/* ------------------ EDIT CATEGORY ------------------ */
router.put("/:id", async (req, res) => {
  try {
    const newName = req.body.name?.trim();
    if (!newName) return res.status(400).json({ error: "Invalid name" });

    const cat = await Category.findById(req.params.id);
    if (!cat) return res.status(404).json({ error: "Category not found" });

    const oldName = cat.name;

    // Update name in Category collection
    cat.name = newName;
    await cat.save();

    // Update all product docs that used the old category name
    await Product.updateMany(
      { category: oldName },
      { $set: { category: newName } }
    );

    res.json(cat);
  } catch {
    res.status(500).json({ error: "Failed to update" });
  }
});

/* ------------------ DELETE ONLY IF EMPTY ------------------ */
router.delete("/:id", async (req, res) => {
  try {
    const cat = await Category.findById(req.params.id);
    if (!cat) return res.status(404).json({ error: "Category not found" });

    const count = await Product.countDocuments({ category: cat.name });

    if (count > 0)
      return res.status(400).json({
        error: "Cannot delete a category that has products",
      });

    await Category.findByIdAndDelete(req.params.id);

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete category" });
  }
});

export default router;
