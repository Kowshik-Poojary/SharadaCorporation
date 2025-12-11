import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import AdminLayout from "./AdminLayout";
import LoadingBar from "react-top-loading-bar";
import toast, { Toaster } from "react-hot-toast";

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [newImageFile, setNewImageFile] = useState(null);
  const [newImagePreview, setNewImagePreview] = useState("");
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

      const form = new FormData();
      form.append("name", name);
      if (newImageFile) form.append("image", newImageFile);

      await axios.post("/api/admin/categories", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setName("");
      setNewImageFile(null);
      setNewImagePreview("");

      toast.success("Category added!");
      loadCategories();
      loaderRef.current.complete();
      setIsLoading(false);
    } catch (err) {
      loaderRef.current.complete();
      setIsLoading(false);
      toast.error("Failed to add category",err);
    }
  };

  /* ------------------ UPLOAD/REPLACE CATEGORY IMAGE ------------------ */
  const uploadCategoryImage = async (id, file) => {
    if (!file) return;

    try {
      loaderRef.current.continuousStart();

      const form = new FormData();
      form.append("image", file);

      await axios.post(`/api/admin/categories/${id}/image`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Image uploaded!");
      loadCategories();
      loaderRef.current.complete();
    } catch {
      loaderRef.current.complete();
      toast.error("Upload failed");
    }
  };

  /* ------------------ EDIT CATEGORY NAME ------------------ */
  const editCategory = async (id, oldName) => {
    const newName = prompt("Enter new category name", oldName);
    if (!newName?.trim()) return;

    try {
      loaderRef.current.continuousStart();
      await axios.put(`/api/admin/categories/${id}`, { name: newName });
      toast.success("Updated!");
      loadCategories();
      loaderRef.current.complete();
    } catch {
      loaderRef.current.complete();
      toast.error("Failed to update");
    }
  };

  /* ------------------ DELETE CATEGORY ------------------ */
  const deleteCategory = async (id, name, productCount) => {
    if (productCount > 0)
      return toast.error(`Cannot delete, ${productCount} products exist.`);

    if (!window.confirm(`Delete category "${name}"?`)) return;

    try {
      loaderRef.current.continuousStart();
      await axios.delete(`/api/admin/categories/${id}`);
      toast.success("Deleted");
      loadCategories();
      loaderRef.current.complete();
    } catch {
      loaderRef.current.complete();
      toast.error("Failed to delete");
    }
  };

  return (
    <AdminLayout>
      <LoadingBar ref={loaderRef} color="#facc15" height={4} />
      <Toaster position="top-center" />

      <h1 className="text-2xl font-bold mb-6">Manage Categories</h1>

      {/* ADD CATEGORY */}
      <div className="bg-white p-4 rounded shadow mb-6 flex flex-col md:flex-row items-center gap-4">
        
        <input
          className="border p-2 rounded w-full md:w-64"
          placeholder="New Category Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label className="cursor-pointer">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files[0];
              setNewImageFile(file);
              setNewImagePreview(URL.createObjectURL(file));
            }}
          />
          <div className="px-3 py-2 bg-gray-100 border rounded">Choose Image</div>
        </label>

        {newImagePreview ? (
          <img
            src={newImagePreview}
            className="w-20 h-20 rounded object-cover border"
          />
        ) : (
          <div className="w-20 h-20 border rounded flex items-center justify-center text-gray-500">
            No Image
          </div>
        )}

        <button
          onClick={addCategory}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {isLoading ? "Adding..." : "Add Category"}
        </button>
      </div>

      {/* CATEGORY LIST */}
      <ul>
        {categories.map((cat) => (
          <li
            key={cat._id}
            className="bg-white shadow p-4 rounded mb-4 flex flex-col md:flex-row justify-between items-center"
          >
            <div className="flex items-center gap-4">
              
              {cat.imageUrl ? (
                <img
                  src={cat.imageUrl}
                  className="w-20 h-20 rounded object-cover border"
                />
              ) : (
                <div className="w-20 h-20 border rounded flex items-center justify-center text-gray-500">
                  No Image
                </div>
              )}

              <div>
                <p className="font-bold text-lg">{cat.name}</p>
                <p className="text-gray-500 text-sm">
                  {cat.productCount} products
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 mt-4 md:mt-0">
              
              {/* Upload / Replace image */}
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) =>
                    uploadCategoryImage(cat._id, e.target.files[0])
                  }
                />
                <div className="px-3 py-2 border rounded bg-gray-50 hover:bg-gray-100">
                  {cat.imageUrl ? "Replace Image" : "Upload Image"}
                </div>
              </label>

              <button
                className="text-blue-600 hover:underline"
                onClick={() => editCategory(cat._id, cat.name)}
              >
                Edit
              </button>

              <button
                className="text-red-600 hover:underline"
                onClick={() => deleteCategory(cat._id, cat.name, cat.productCount)}
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
