import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "./AdminLayout";

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");

  useEffect(() => {
    loadCategories();
  }, []);

  /* ------------------ LOAD CATEGORIES ------------------ */
  const loadCategories = async () => {
    try {
      const res = await axios.get("/api/admin/categories");
      setCategories(res.data); // [{_id, name, productCount}]
    } catch {
      setCategories([]);
    }
  };

  /* ------------------ ADD CATEGORY ------------------ */
  const addCategory = async () => {
    if (!name.trim()) return alert("Category name cannot be empty");

    try {
      await axios.post("/api/admin/categories", { name });
      setName("");
      loadCategories();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to add category");
    }
  };

  /* ------------------ EDIT CATEGORY ------------------ */
  const editCategory = async (id, oldName) => {
    const newName = prompt("Enter new name", oldName);
    if (!newName?.trim()) return;

    try {
      await axios.put(`/api/admin/categories/${id}`, { name: newName });
      loadCategories();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to update category");
    }
  };

  /* ------------------ DELETE CATEGORY ------------------ */
  const deleteCategory = async (id, name, productCount) => {
    if (productCount > 0) {
      return alert(
        `❌ Cannot delete "${name}". It has ${productCount} product(s).`
      );
    }

    if (!window.confirm(`Delete empty category "${name}"?`)) return;

    try {
      await axios.delete(`/api/admin/categories/${id}`);
      loadCategories();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to delete category");
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">Manage Categories</h1>

      {/* ADD CATEGORY */}
      <div className="flex gap-2 mb-4">
        <input
          className="border p-2 w-64"
          placeholder="New Category Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button
          onClick={addCategory}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Category
        </button>
      </div>

      {/* LIST */}
      <ul>
        {categories.map((cat) => (
          <li
            key={cat._id}
            className="border p-3 rounded flex justify-between items-center mb-2"
          >
            <div>
              <span className="font-semibold">{cat.name}</span>
              <span className="text-sm text-gray-500 ml-2">
                ({cat.productCount} products)
              </span>
            </div>

            <div className="flex gap-4">
              <button
                className="text-blue-600"
                onClick={() => editCategory(cat._id, cat.name)}
              >
                Edit
              </button>

              <button
                className={
                  cat.productCount > 0
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-red-600"
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
