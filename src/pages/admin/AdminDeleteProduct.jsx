import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import AdminLayout from "./AdminLayout";
import SearchSelect from "../../components/SearchSelect";
import LoadingBar from "react-top-loading-bar";
import toast, { Toaster } from "react-hot-toast";

export default function AdminDeleteProduct() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const loaderRef = useRef(null);

  /* ---------------- LOAD ALL CATEGORIES ---------------- */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        loaderRef.current.continuousStart();
        const res = await axios.get("/api/products/all/list");
        setCategories(res.data);
        loaderRef.current.complete();
      } catch {
        setCategories([]);
        loaderRef.current.complete();
        toast.error("Failed to load categories.");
      }
    };

    fetchCategories();
  }, []);

  /* ---------------- LOAD PRODUCTS BY CATEGORY ---------------- */
  const loadProducts = async (categoryName) => {
    setSelectedCategory(categoryName);
    setSelectedProducts([]);

    if (!categoryName) return setProducts([]);

    try {
      loaderRef.current.continuousStart();
      const res = await axios.get(`/api/products/category/${categoryName}`);
      setProducts(res.data);
      loaderRef.current.complete();
    } catch {
      loaderRef.current.complete();
      toast.error("Failed to load products.");
    }
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
      return toast.error("Select at least one product to delete.");

    if (!window.confirm("Are you sure? This will permanently delete products."))
      return;

    try {
      setIsLoading(true);
      loaderRef.current.continuousStart();

      for (const pid of selectedProducts) {
        await axios.delete(`/api/admin/products/${pid}`);
      }

      toast.success("Products deleted successfully!");

      await loadProducts(selectedCategory);
      setSelectedProducts([]);

      loaderRef.current.complete();
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      toast.error("Error deleting products.");
      loaderRef.current.complete();
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout>
      {/* Loader + Toast */}
      <LoadingBar ref={loaderRef} color="#facc15" height={4} />
      <Toaster position="top-center" />

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
          disabled={isLoading}
          className={`px-6 py-2 rounded shadow mb-4 text-white transition ${
            isLoading
              ? "bg-red-300 cursor-wait"
              : "bg-red-600 hover:bg-red-700"
          }`}
        >
          {isLoading ? "Deleting..." : "Delete Selected Products"}
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
              disabled={isLoading}
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
