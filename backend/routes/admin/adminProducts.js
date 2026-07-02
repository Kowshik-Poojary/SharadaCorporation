import express from "express";
import Product from "../../models/Product.js";
import upload from "../../utils/multer.js";
import { uploadToCloudinary } from "../../utils/cloudinary.js";

const router = express.Router();

/* ---------------------------
  POST: create product with variants
  Mount path (server): /api/admin/products/add-with-variants
---------------------------- */
router.post("/add-with-variants", upload.any(), async (req, res) => {
  try {
    console.log("REQ BODY RAW:", req.body);

    const { name, category } = req.body;
    const variants = {};

    // Parse dot notation keys
    for (const key in req.body) {
      let m;

      // variants.0.data.Size
      m = key.match(/^variants\.(\d+)\.data\.(.+)$/);
      if (m) {
        const index = m[1];
        const dataKey = m[2];

        if (!variants[index]) variants[index] = { data: {} };
        variants[index].data[dataKey] = req.body[key];
        continue;
      }

      // variants.0.code
      m = key.match(/^variants\.(\d+)\.code$/);
      if (m) {
        const index = m[1];
        if (!variants[index]) variants[index] = { data: {} };
        variants[index].code = req.body[key];
      }
    }

    // Parse files
    for (const file of req.files) {
      const match = file.fieldname.match(/^variants\.(\d+)\.image$/);
      if (!match) continue;

      const index = match[1];
      const uploadRes = await uploadToCloudinary(file);

      if (!variants[index]) variants[index] = { data: {} };
      variants[index].imageUrl = uploadRes.secure_url;
    }

    const variantArray = Object.values(variants);

    const product = await Product.create({
      name,
      category,
      variants: variantArray,
      representativeVariant: null,
    });

    return res.json({ success: true, product });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to create product" });
  }
});

/* ---------------------------
  POST: add variants to an existing product
  Mount path: /api/admin/products/add-variants
---------------------------- */
router.post("/add-variants", upload.any(), async (req, res) => {
  try {
    console.log("VARIANT BODY:", req.body);

    const { productId } = req.body;
    const variants = {};

    // Parse variant data
    for (const key in req.body) {
      let m;

      // variants.0.data.Size
      m = key.match(/^variants\.(\d+)\.data\.(.+)$/);
      if (m) {
        const index = m[1];
        const dataKey = m[2];

        if (!variants[index]) variants[index] = { data: {} };
        variants[index].data[dataKey] = req.body[key];
        continue;
      }

      // variants.0.code
      m = key.match(/^variants\.(\d+)\.code$/);
      if (m) {
        const index = m[1];
        if (!variants[index]) variants[index] = { data: {} };
        variants[index].code = req.body[key];
      }
    }

    // Parse images
    for (const file of req.files) {
      const match = file.fieldname.match(/^variants\.(\d+)\.image$/);
      if (!match) continue;

      const index = match[1];
      const uploadRes = await uploadToCloudinary(file);

      if (!variants[index]) variants[index] = { data: {} };
      variants[index].imageUrl = uploadRes.secure_url;
    }

    const variantArray = Object.values(variants);

    // PUSH VARIANTS INTO EXISTING PRODUCT
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { $push: { variants: { $each: variantArray } } },
      { new: true },
    );

    return res.json({ success: true, product: updatedProduct });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add variants" });
  }
});

/* ---------------------------
  GET: list all products (admin)
  Mount path: /api/admin/products/
---------------------------- */
router.get("/", async (req, res) => {
  try {
    // const products = await Product.find({});
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [products, totalProducts] = await Promise.all([
      Product.find({}).skip(skip).limit(limit).sort({ createdAt: -1 }).lean(),
      Product.countDocuments({}),
    ]);
    res.json({
      products,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
      totalProducts,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load products" });
  }
});

/* ---------------------------
  GET: list products by category (admin)
  Mount path: /api/admin/products/category/:categoryName
  NOTE: case-insensitive match
---------------------------- */
router.get("/category/:categoryName", async (req, res) => {
  try {
    const { categoryName } = req.params;

    const products = await Product.find({
      category: { $regex: new RegExp(`^${categoryName.trim()}$`, "i") },
    });

    res.json(products);
  } catch (err) {
    console.error("LOAD CATEGORY PRODUCTS ERROR:", err);
    res.status(500).json({ error: "Failed to load products for category" });
  }
});

/* ---------------------------
  GET: single product by id (admin)
  Mount path: /api/admin/products/:id
---------------------------- */
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load product" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        category: req.body.category,
        description: req.body.description,
      },
      { new: true },
    );

    res.json(updated);
  } catch (err) {
    console.error("ERROR updating product:", err);
    res.status(500).json({ error: "Failed to update product" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error("ERROR deleting product:", err);
    res.status(500).json({ error: "Failed to delete product" });
  }
});

router.put("/:pid/variants/:vid", async (req, res) => {
  try {
    const { pid, vid } = req.params;

    const updated = await Product.findOneAndUpdate(
      { _id: pid, "variants._id": vid },
      {
        $set: {
          "variants.$.code": req.body.code,
          // Optionally allow updating data fields later
        },
      },
      { new: true },
    );

    res.json(updated);
  } catch (err) {
    console.error("ERROR updating variant:", err);
    res.status(500).json({ error: "Failed to update variant" });
  }
});

router.delete("/:pid/variants/:vid", async (req, res) => {
  try {
    const { pid, vid } = req.params;

    const updated = await Product.findByIdAndUpdate(
      pid,
      { $pull: { variants: { _id: vid } } },
      { new: true },
    );

    res.json(updated);
  } catch (err) {
    console.error("ERROR deleting variant:", err);
    res.status(500).json({ error: "Failed to delete variant" });
  }
});

/* ------------------ UPLOAD IMAGE FOR A VARIANT ------------------ */
router.post(
  "/:productId/variant/:variantId/image",
  upload.single("image"),
  async (req, res) => {
    try {
      const { productId, variantId } = req.params;

      if (!req.file) return res.status(400).json({ error: "No file uploaded" });

      const product = await Product.findById(productId);
      if (!product) return res.status(404).json({ error: "Product not found" });

      const variant = product.variants.id(variantId);
      if (!variant) return res.status(404).json({ error: "Variant not found" });

      // Upload to Cloudinary inside category folder
      const folderName = product.category.replace(/\s+/g, "_");

      const uploaded = await uploadToCloudinary(req.file, {
        folder: `Products/${folderName}/Variants`,
      });

      variant.imageUrl = uploaded.secure_url;
      await product.save();

      res.json({
        success: true,
        imageUrl: uploaded.secure_url,
      });
    } catch (err) {
      console.error("Variant Upload Error:", err);
      res.status(500).json({ error: "Upload failed" });
    }
  },
);

export default router;
