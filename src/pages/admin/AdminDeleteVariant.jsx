import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import AdminLayout from "./AdminLayout";
import SearchSelect from "../../components/SearchSelect";
import LoadingBar from "react-top-loading-bar";
import toast, { Toaster } from "react-hot-toast";

export default function AdminDeleteVariant() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [variants, setVariants] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");

  const [selectedVariants, setSelectedVariants] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const loaderRef = useRef(null);

  /* ------------------ LOAD CATEGORIES ------------------ */
  useEffect(() => {
    const loadCategories = async () => {
      try {
        loaderRef.current.continuousStart();
        const res = await axios.get("/api/products/all/list");
        setCategories(res.data);
        loaderRef.current.complete();
      } catch {
        loaderRef.current.complete();
        toast.error("Failed to load categories.");
      }
    };

    loadCategories();
  }, []);

  /* ------------------ LOAD PRODUCTS ------------------ */
  const loadProducts = async (categoryName) => {
    setSelectedProduct("");
    setVariants([]);
    setSelectedVariants([]);

    try {
      loaderRef.current.continuousStart();
      const res = await axios.get(`/api/admin/products/category/${categoryName}`);
      setProducts(res.data);
      loaderRef.current.complete();
    } catch {
      loaderRef.current.complete();
      toast.error("Failed to load products.");
    }
  };

  /* ------------------ LOAD VARIANTS ------------------ */
  const loadVariants = async (productId) => {
    setSelectedProduct(productId);
    setSelectedVariants([]);

    try {
      loaderRef.current.continuousStart();
      const res = await axios.get(`/api/admin/products/${productId}`);
      setVariants(res.data.variants || []);
      loaderRef.current.complete();
    } catch {
      loaderRef.current.complete();
      toast.error("Failed to load variants.");
    }
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
      return toast.error("Select at least one variant to delete.");

    if (!window.confirm("Are you sure you want to delete these variants?"))
      return;

    try {
      setIsLoading(true);
      loaderRef.current.continuousStart();

      for (const vid of selectedVariants) {
        await axios.delete(
          `/api/admin/products/${selectedProduct}/variants/${vid}`
        );
      }

      toast.success("Variants deleted successfully!");

      await loadVariants(selectedProduct);
      setSelectedVariants([]);

      loaderRef.current.complete();
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete variants.");
      loaderRef.current.complete();
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout>
      {/* Loader + Toast */}
      <LoadingBar ref={loaderRef} color="#facc15" height={4} />
      <Toaster position="top-center" />

      <h1 className="text-3xl font-bold mb-6">Delete Variant(s)</h1>

      {/* CATEGORY SELECT */}
      <SearchSelect
        label="Select Category"
        options={categories.map((c) => ({ label: c.trim(), value: c.trim() }))}
        value={selectedCategory}
        onChange={(val) => {
          setSelectedCategory(val);
          loadProducts(val);
        }}
      />

      {/* PRODUCT SELECT */}
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
          disabled={isLoading}
          className={`px-6 py-2 rounded text-white shadow mb-4 transition ${
            isLoading
              ? "bg-red-300 cursor-wait"
              : "bg-red-600 hover:bg-red-700"
          }`}
        >
          {isLoading ? "Deleting..." : "Delete Selected Variants"}
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
              disabled={isLoading}
              className="mt-2 w-5 h-5"
            />

            {/* Variant Image */}
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
