import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminLayout from "./AdminLayout";
import toast, { Toaster } from "react-hot-toast";

export default function AdminBestSellerVariants() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [variants, setVariants] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [bestSellers, setBestSellers] = useState([]);

  /* Load categories */
  useEffect(() => {
    axios.get("/api/admin/categories/all/list").then(res => setCategories(res.data));
    loadBestSellers();
  }, []);

  const loadProducts = async (cat) => {
    setSelectedProduct("");
    const res = await axios.get(`/api/admin/products/category/${cat}`);
    setProducts(res.data);
  };

  const loadVariants = async (productId) => {
    setSelectedProduct(productId);
    const res = await axios.get(`/api/admin/products/${productId}`);
    setVariants(res.data.variants || []);
  };

  const loadBestSellers = async () => {
    const res = await axios.get("/api/admin/best-seller-variants");
    setBestSellers(res.data);
  };

  const toggleBestSeller = async (productId, variantId, already) => {
    try {
      if (already) {
        await axios.delete(`/api/admin/best-seller-variants/remove/${variantId}`);
      } else {
        await axios.post(`/api/admin/best-seller-variants/add/${productId}/${variantId}`);
      }

      toast.success("Updated!");
      loadBestSellers();
    } catch {
      toast.error("Error updating best seller");
    }
  };

  const isVariantBestSeller = (variantId) =>
    bestSellers.some((b) => b.variant._id === variantId);

  return (
    <AdminLayout>
      <Toaster />

      <h1 className="text-2xl font-bold mb-4">Manage Best Selling Variants</h1>

      {/* Category Select */}
      <select
        className="border p-2 rounded mb-4"
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

      {/* Product Select */}
      <select
        className="border p-2 rounded mb-4"
        value={selectedProduct}
        disabled={!selectedCategory}
        onChange={(e) => loadVariants(e.target.value)}
      >
        <option value="">Select Product</option>
        {products.map((p) => (
          <option key={p._id} value={p._id}>{p.name}</option>
        ))}
      </select>

      {/* Variants List */}
      <div className="space-y-4">
        {variants.map((v) => (
          <div key={v._id} className="flex items-center gap-4 border p-3 rounded shadow">
            <img src={v.imageUrl || "/placeholder.webp"} className="w-20 h-20 object-cover rounded" />

            <div className="flex-1">
              <p className="font-semibold">Code: {v.code}</p>
            </div>

            <button
              onClick={() =>
                toggleBestSeller(selectedProduct, v._id, isVariantBestSeller(v._id))
              }
              className={`px-4 py-2 rounded text-white ${
                isVariantBestSeller(v._id)
                  ? "bg-red-600"
                  : "bg-green-600"
              }`}
            >
              {isVariantBestSeller(v._id) ? "Remove" : "Add"}
            </button>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
