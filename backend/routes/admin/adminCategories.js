import express from "express";
import Category from "../../models/Category.js";
import Product from "../../models/Product.js";


const router = express.Router();

// GET all categories
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    console.error("Categories Error:", err);
    res.status(500).json({ error: "Failed to load categories" });
  }
});

// Add new category
router.post("/", async (req, res) => {
  try {
    let { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: "Category name cannot be empty" });
    }

    name = name.trim();

    // Prevent duplicates (case-insensitive)
    const exists = await Category.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") }
    });

    if (exists) {
      return res.status(400).json({ error: "Category already exists" });
    }

    const cat = await Category.create({ name });
    res.json(cat);

  } catch (err) {
    console.error("Create Category Error:", err);
    res.status(500).json({ error: "Failed to create category" });
  }
});


// Delete category
router.delete("/:id", async (req, res) => {
  try {
    const cat = await Category.findById(req.params.id);
    if (!cat) return res.status(404).json({ error: "Category not found" });

    // Check if any product is using this category
    const productCount = await Product.countDocuments({ category: cat.name });
    if (productCount > 0) {
      return res.status(400).json({
        error: "Cannot delete — products exist under this category"
      });
    }

    await Category.findByIdAndDelete(req.params.id);
    res.json({ success: true });

  } catch (err) {
    console.error("Delete Category Error:", err);
    res.status(500).json({ error: "Failed to delete category" });
  }
});

// Update category name
router.put("/:id", async (req, res) => {
  try {
    const { name } = req.body;
    if (!name.trim()) return res.status(400).json({ error: "Empty name" });

    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ error: "Not found" });

    const oldName = category.name;
    const newName = name.trim();

    // Update category name
    category.name = newName;
    await category.save();

    // Update all products referencing this category
    await Product.updateMany(
      { category: oldName },
      { $set: { category: newName } }
    );

    res.json(category);
  } catch (err) {
    res.status(500).json({ error: "Failed to update category" });
  }
});



router.get("/list/names", async (req, res) => {
  try {
    const list = await Category.find().select("name -_id");
    res.json(list.map(c => c.name));
  } catch (err) {
    res.status(500).json({ error: "Failed to load category names" });
  }
});

router.get("/all/list", async (req, res) => {
  try {
    const productCats = await Product.distinct("category");
    const categoryDocs = await Category.find().select("name -_id");

    const manualCats = categoryDocs.map(c => c.name);

    // merge
    const all = Array.from(new Set([...productCats, ...manualCats])).filter(Boolean);

    res.json(all);
  } catch (err) {
    res.status(500).json({ error: "Failed to load categories" });
  }
});

router.get("/all/list", async (req, res) => {
  try {
    const productCats = await Product.distinct("category");
    const manualCats = await Category.find().select("name -_id");

    const merged = Array.from(
      new Set([
        ...productCats.map((c) => c?.trim()),
        ...manualCats.map((c) => c.name.trim())
      ])
    ).filter(Boolean);

    res.json(merged);
  } catch (err) {
    res.status(500).json({ error: "Failed to load categories" });
  }
});


export default router;
