import express from "express";
import Category from "../../models/Category.js";
import Product from "../../models/Product.js";
import { upload, uploadToCloudinary } from "../../utils/cloudinary.js";

const router = express.Router();

/* ==========================================================
    MERGED CATEGORY LIST — FOR SELECT DROPDOWNS
   ========================================================== */
router.get("/all", async (req, res) => {
  try {
    const cats = await Category.find().sort({ name: 1 });

    const formatted = cats.map((c) => ({
      _id: c._id,
      name: c.name,
      imageUrl: c.imageUrl || null,
      link: c.link || `/products/catalogue/${encodeURIComponent(c.name)}`
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: "Failed to load categories" });
  }
});

/* ==========================================================
    MERGED LIST OF CATEGORY NAMES ONLY — used in dropdowns
   ========================================================== */
router.get("/all/list", async (req, res) => {
  try {
    const productCats = await Product.distinct("category");
    const manualCats = await Category.find().select("name -_id");

    const merged = Array.from(
      new Set([
        ...productCats.map((x) => x?.trim()),
        ...manualCats.map((x) => x.name?.trim()),
      ])
    )
      .filter(Boolean)
      .sort();

    res.json(merged);
  } catch (err) {
    res.status(500).json({ error: "Failed to load categories list" });
  }
});

/* ==========================================================
    ADMIN CATEGORY TABLE — WITH PRODUCT COUNT
   ========================================================== */
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });

    const result = await Promise.all(
      categories.map(async (c) => ({
        _id: c._id,
        name: c.name,
        imageUrl: c.imageUrl || null,
        link: c.link,
        productCount: await Product.countDocuments({ category: c.name }),
      }))
    );

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Failed to load categories" });
  }
});

/* ==========================================================
    ADD CATEGORY
   ========================================================== */
router.post("/", upload.single("image"), async (req, res) => {
  try {
    let uploadedUrl = "";

    if (req.file) {
      const uploaded = await uploadToCloudinary(req.file, {
        folder: "Categories",
      });
      uploadedUrl = uploaded.secure_url;
    }

    const name = req.body.name.trim();

    const link = `/products/catalogue/${encodeURIComponent(name)}`;

    const category = await Category.create({
      name,
      imageUrl: uploadedUrl,
      link,
    });

    res.json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ==========================================================
    UPDATE CATEGORY NAME
   ========================================================== */
router.put("/:id", async (req, res) => {
  try {
    const newName = req.body.name?.trim();

    if (!newName) return res.status(400).json({ error: "Invalid name" });

    const cat = await Category.findById(req.params.id);
    if (!cat) return res.status(404).json({ error: "Category not found" });

    const oldName = cat.name;

    cat.name = newName;
    cat.link = `/products/catalogue/${encodeURIComponent(newName)}`;
    await cat.save();

    // update product docs
    await Product.updateMany(
      { category: oldName },
      { $set: { category: newName } }
    );

    res.json(cat);
  } catch (err) {
    res.status(500).json({ error: "Failed to update category" });
  }
});

/* ==========================================================
    DELETE CATEGORY (ONLY IF NO PRODUCTS)
   ========================================================== */
router.delete("/:id", async (req, res) => {
  try {
    const cat = await Category.findById(req.params.id);
    if (!cat) return res.status(404).json({ error: "Category not found" });

    const count = await Product.countDocuments({ category: cat.name });

    if (count > 0) {
      return res.status(400).json({
        error: "Cannot delete category with existing products",
      });
    }

    await Category.findByIdAndDelete(req.params.id);

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete category" });
  }
});

/* ==========================================================
    UPLOAD / REPLACE CATEGORY IMAGE
   ========================================================== */
router.post("/:id/image", upload.single("image"), async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ error: "No image uploaded" });

    const cat = await Category.findById(req.params.id);
    if (!cat)
      return res.status(404).json({ error: "Category not found" });

    const uploaded = await uploadToCloudinary(req.file, {
      folder: "Categories",
    });

    cat.imageUrl = uploaded.secure_url;
    await cat.save();

    res.json({
      message: "Category image updated",
      imageUrl: cat.imageUrl,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to upload image" });
  }
});

export default router;
