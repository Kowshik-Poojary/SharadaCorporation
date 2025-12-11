import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import AdminLayout from "./AdminLayout";
import LoadingBar from "react-top-loading-bar";
import toast, { Toaster } from "react-hot-toast";

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const loaderRef = useRef(null);

  useEffect(() => {
    loadCategories();
  }, []);

  /* ------------------ LOAD CATEGORIES ------------------ */
  const loadCategories = async () => {
    try {
      loaderRef.current.continuousStart();
      const res = await axios.get("/api/admin/categories");
      setCategories(res.data);
      loaderRef.current.complete();
    } catch {
      setCategories([]);
      loaderRef.current.complete();
      toast.error("Failed to load categories");
    }
  };

  /* ------------------ ADD CATEGORY ------------------ */
  const addCategory = async () => {
    if (!name.trim()) return toast.error("Category name cannot be empty");

    try {
      setIsLoading(true);
      loaderRef.current.continuousStart();

      await axios.post("/api/admin/categories", { name });

      setName("");
      toast.success("Category added!");
      await loadCategories();

      loaderRef.current.complete();
      setIsLoading(false);
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to add category");
      loaderRef.current.complete();
      setIsLoading(false);
    }
  };

  /* ------------------ EDIT CATEGORY ------------------ */
  const editCategory = async (id, oldName) => {
    const newName = prompt("Enter new category name", oldName);

    if (!newName?.trim()) return toast.error("Name cannot be empty");

    try {
      setIsLoading(true);
      loaderRef.current.continuousStart();

      await axios.put(`/api/admin/categories/${id}`, { name: newName });

      toast.success("Category updated!");
      await loadCategories();

      loaderRef.current.complete();
      setIsLoading(false);
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to update category");
      loaderRef.current.complete();
      setIsLoading(false);
    }
  };

  /* ------------------ DELETE CATEGORY ------------------ */
  const deleteCategory = async (id, name, productCount) => {
    if (productCount > 0) {
      return toast.error(
        `Cannot delete "${name}". It has ${productCount} products.`
      );
    }

    if (!window.confirm(`Delete category "${name}"?`)) return;

    try {
      setIsLoading(true);
      loaderRef.current.continuousStart();

      await axios.delete(`/api/admin/categories/${id}`);

      toast.success("Category deleted");
      await loadCategories();

      loaderRef.current.complete();
      setIsLoading(false);
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to delete");
      loaderRef.current.complete();
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout>
      {/* Loading bar + Toast */}
      <LoadingBar ref={loaderRef} color="#facc15" height={4} />
      <Toaster position="top-center" />

      <h1 className="text-2xl font-bold mb-6">Manage Categories</h1>

      {/* ADD CATEGORY */}
      <div className="flex gap-2 mb-4">
        <input
          className="border p-2 w-64 rounded"
          placeholder="New Category Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button
          onClick={addCategory}
          disabled={isLoading}
          className={`px-4 py-2 rounded text-white ${
            isLoading
              ? "bg-blue-400 cursor-wait"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isLoading ? "Adding..." : "Add Category"}
        </button>
      </div>

      {/* CATEGORY LIST */}
      <ul>
        {categories.map((cat) => (
          <li
            key={cat._id}
            className="border p-3 rounded flex justify-between items-center mb-2 bg-white shadow"
          >
            <div>
              <span className="font-semibold">{cat.name}</span>
              <span className="text-sm text-gray-500 ml-2">
                ({cat.productCount} products)
              </span>
            </div>

            <div className="flex gap-4">
              <button
                disabled={isLoading}
                className="text-blue-600 hover:underline disabled:text-gray-400"
                onClick={() => editCategory(cat._id, cat.name)}
              >
                Edit
              </button>

              <button
                disabled={isLoading}
                className={
                  cat.productCount > 0
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-red-600 hover:underline"
                }
                onClick={() =>
                  deleteCategory(cat._id, cat.name, cat.productCount)
                }
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </AdminLayout>
  );
}
