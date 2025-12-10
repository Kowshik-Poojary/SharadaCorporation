import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "./AdminLayout";

export default function AdminUploadImages() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [variants, setVariants] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");

  /* ------------------ LOAD CATEGORIES ------------------ */
  useEffect(() => {
    axios
      .get("/api/admin/categories/all/list")
      .then((res) => setCategories(res.data))
      .catch(() => setCategories([]));
  }, []);

  /* ------------------ LOAD PRODUCTS ------------------ */
  const loadProducts = async (cat) => {
    setSelectedProduct("");
    setVariants([]);
    const res = await axios.get(`/api/admin/products/category/${cat}`);
    setProducts(res.data);
  };

  /* ------------------ LOAD VARIANTS ------------------ */
  const loadVariants = async (productId) => {
    const res = await axios.get(`/api/admin/products/${productId}`);
    setVariants(res.data.variants || []);
  };

  /* ------------------ UPLOAD IMAGE TO VARIANT ------------------ */
  const uploadImage = async (variantId, file) => {
    if (!file) return;

    const form = new FormData();
    form.append("image", file);

    await axios.post(
      `/api/admin/products/${selectedProduct}/variant/${variantId}/image`,
      form,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    alert("Image uploaded!");
    loadVariants(selectedProduct);
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">Upload / Replace Variant Images</h1>

      {/* CATEGORY */}
      <select
        className="border p-2 rounded w-full md:w-1/2 mb-4"
        value={selectedCategory}
        onChange={(e) => {
          setSelectedCategory(e.target.value);
          loadProducts(e.target.value);
        }}
      >
        <option value="">Select Category</option>
        {categories.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>

      {/* PRODUCT */}
      <select
        className="border p-2 rounded w-full md:w-1/2 mb-4"
        value={selectedProduct}
        onChange={(e) => {
          setSelectedProduct(e.target.value);
          loadVariants(e.target.value);
        }}
        disabled={!selectedCategory}
      >
        <option value="">Select Product</option>
        {products.map((p) => (
          <option key={p._id} value={p._id}>{p.name}</option>
        ))}
      </select>

      {/* VARIANTS */}
      {variants.length > 0 && (
        <div className="space-y-4 mt-6">
          {variants.map((v) => (
            <div
              key={v._id}
              className="border p-4 bg-white rounded shadow flex items-center gap-4"
            >
              <div>
                <strong>Code:</strong> {v.code}
              </div>

              <div>
                {v.imageUrl ? (
                  <img
                    src={v.imageUrl}
                    className="w-24 h-24 object-cover border rounded"
                  />
                ) : (
                  <div className="w-24 h-24 border rounded flex items-center justify-center text-gray-500">
                    No Image
                  </div>
                )}
              </div>

              <input
                type="file"
                accept="image/*"
                onChange={(e) => uploadImage(v._id, e.target.files[0])}
              />
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
