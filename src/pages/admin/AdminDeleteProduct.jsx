import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "./AdminLayout";
import SearchSelect from "../../components/SearchSelect";

export default function AdminDeleteProduct() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);

  /* ---------------- LOAD ALL CATEGORIES ---------------- */
  useEffect(() => {
    axios
      .get("/api/products/all/list")
      .then((res) => setCategories(res.data))
      .catch(() => setCategories([]));
  }, []);

  /* ---------------- LOAD PRODUCTS BY CATEGORY ---------------- */
  const loadProducts = async (categoryName) => {
    setSelectedCategory(categoryName);
    setSelectedProducts([]); // reset selection

    if (!categoryName) return setProducts([]);

    const res = await axios.get(`/api/products/category/${categoryName}`);
    setProducts(res.data);
  };

  /* ---------------- TOGGLE PRODUCT SELECTION ---------------- */
  const toggleProduct = (productId) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  /* ---------------- DELETE SELECTED PRODUCTS ---------------- */
  const deleteProducts = async () => {
    if (selectedProducts.length === 0)
      return alert("Select at least one product to delete.");

    if (!window.confirm("Are you sure? This will permanently delete products."))
      return;

    try {
      for (const pid of selectedProducts) {
        await axios.delete(`/api/admin/products/${pid}`);
      }

      alert("Products deleted successfully!");

      // Refresh list
      loadProducts(selectedCategory);
      setSelectedProducts([]);
    } catch (err) {
      console.error(err);
      alert("Error deleting products");
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6">Delete Products</h1>

      {/* CATEGORY SELECT */}
      <SearchSelect
        label="Select Category"
        options={categories.map((c) => ({ label: c.trim(), value: c.trim() }))}
        value={selectedCategory}
        onChange={loadProducts}
      />

      {/* DELETE BUTTON */}
      {products.length > 0 && (
        <button
          onClick={deleteProducts}
          className="bg-red-600 text-white px-6 py-2 rounded shadow mb-4 hover:bg-red-700 transition"
        >
          Delete Selected Products
        </button>
      )}

      {/* PRODUCT LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {products.map((p) => (
          <div
            key={p._id}
            className="bg-white p-4 rounded shadow border flex gap-4 items-start"
          >
            {/* Checkbox */}
            <input
              type="checkbox"
              checked={selectedProducts.includes(p._id)}
              onChange={() => toggleProduct(p._id)}
              className="mt-2 w-5 h-5"
            />

            {/* Product Image */}
            <img
              src={
                p.imageUrl ||
                p.variants?.[0]?.imageUrl ||
                "/placeholder.webp"
              }
              alt="product"
              className="w-20 h-20 object-cover rounded border"
            />

            {/* Product Info */}
            <div className="flex-1">
              <p className="font-bold text-lg">{p.name}</p>
              <p className="text-sm text-gray-600">{p.category}</p>

              <pre className="bg-gray-100 text-xs p-2 rounded mt-2 overflow-x-auto">
                {JSON.stringify(p.variants?.[0]?.data, null, 2)}
              </pre>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
