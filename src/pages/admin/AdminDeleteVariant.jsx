import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "./AdminLayout";
import SearchSelect from "../../components/SearchSelect";

export default function AdminDeleteVariant() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [variants, setVariants] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");

  const [selectedVariants, setSelectedVariants] = useState([]);

  /* ------------------ LOAD CATEGORIES ------------------ */
  useEffect(() => {
    axios
      .get("/api/products/all/list")
      .then((res) => setCategories(res.data))
      .catch(() => setCategories([]));
  }, []);

  /* ------------------ LOAD PRODUCTS ------------------ */
  const loadProducts = async (categoryName) => {
    setSelectedProduct("");
    setVariants([]);

    const res = await axios.get(`/api/admin/products/category/${categoryName}`);
    setProducts(res.data);
  };

  /* ------------------ LOAD VARIANTS ------------------ */
  const loadVariants = async (productId) => {
    setSelectedProduct(productId);

    const res = await axios.get(`/api/admin/products/${productId}`);
    setVariants(res.data.variants || []);
  };

  /* ------------------ SELECT / DESELECT VARIANT ------------------ */
  const toggleVariant = (variantId) => {
    setSelectedVariants((prev) =>
      prev.includes(variantId)
        ? prev.filter((id) => id !== variantId)
        : [...prev, variantId]
    );
  };

  /* ------------------ DELETE SELECTED VARIANTS ------------------ */
  const deleteSelected = async () => {
    if (selectedVariants.length === 0)
      return alert("Select at least one variant to delete.");

    if (!window.confirm("Are you sure you want to delete selected variants?"))
      return;

    try {
      for (const vid of selectedVariants) {
        await axios.delete(
          `/api/admin/products/${selectedProduct}/variants/${vid}`
        );
      }

      alert("Deleted successfully!");

      // Refresh UI
      loadVariants(selectedProduct);
      setSelectedVariants([]);
    } catch (err) {
      console.error(err);
      alert("Failed to delete variants");
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6">Delete Variant(s)</h1>

      {/* CATEGORY DROPDOWN */}
      <SearchSelect
        label="Select Category"
        options={categories.map((c) => ({ label: c.trim(), value: c.trim() }))}
        value={selectedCategory}
        onChange={(val) => {
          setSelectedCategory(val);
          loadProducts(val);
        }}
      />

      {/* PRODUCT DROPDOWN */}
      <SearchSelect
        label="Select Product"
        options={products.map((p) => ({ label: p.name, value: p._id }))}
        value={selectedProduct}
        onChange={loadVariants}
      />

      {/* DELETE BUTTON */}
      {variants.length > 0 && (
        <button
          onClick={deleteSelected}
          className="bg-red-600 text-white px-6 py-2 rounded shadow mb-4 hover:bg-red-700 transition"
        >
          Delete Selected Variants
        </button>
      )}

      {/* VARIANT LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {variants.map((v) => (
          <div
            key={v._id}
            className="bg-white p-4 rounded shadow border flex gap-4 items-start"
          >
            {/* Checkbox */}
            <input
              type="checkbox"
              checked={selectedVariants.includes(v._id)}
              onChange={() => toggleVariant(v._id)}
              className="mt-2 w-5 h-5"
            />

            {/* Image */}
            <img
              src={v.imageUrl || "/placeholder.webp"}
              alt="variant"
              className="w-20 h-20 object-cover rounded border"
            />

            {/* Variant Info */}
            <div className="flex-1">
              <p className="font-bold">Code: {v.code}</p>

              <pre className="bg-gray-100 text-xs p-2 rounded mt-2 overflow-x-auto">
                {JSON.stringify(v.data, null, 2)}
              </pre>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
