import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "./AdminLayout";

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");

  useEffect(() => {
    axios.get("/api/admin/categories")
      .then((res) => setCategories(res.data))
      .catch(() => setCategories([]));
  }, []);

  /* ------------------ ADD CATEGORY ------------------ */
  const add = async () => {
    if (!name.trim()) return alert("Category name cannot be empty");

    try {
      const res = await axios.post("/api/admin/categories", { name });
      setCategories([...categories, res.data]);
      setName("");
    } catch (err) {
      alert(err.response?.data?.error || "Failed to add category");
    }
  };

  /* ------------------ EDIT CATEGORY ------------------ */
  const editCategory = async (id, oldName) => {
  const newName = prompt("Enter new name", oldName);
  if (!newName || !newName.trim()) return;

  try {
    const res = await axios.put(`/api/admin/categories/${id}`, {
      name: newName,
      oldName
    });

    setCategories(
      categories.map((c) =>
        c._id === id ? { ...c, name: res.data.name } : c
      )
    );
  } catch (err) {
    alert(err.response?.data?.error || "Failed to update category");
  }
};

  /* ------------------ DELETE CATEGORY ------------------ */
  const remove = async (id) => {
    if (!window.confirm("Delete this category?")) return;

    try {
      await axios.delete(`/api/admin/categories/${id}`);
      setCategories(categories.filter((c) => c._id !== id));
    } catch (err) {
      alert(err.response?.data?.error || "Delete failed");
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">Categories</h1>

      {/* ADD CATEGORY INPUT */}
      <div className="flex gap-2 mb-4">
        <input
          className="border p-2 w-64"
          placeholder="New Category Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button
          onClick={add}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </div>

      {/* CATEGORY LIST */}
      <ul>
        {categories.map((c) => (
          <li
            key={c._id}
            className="border p-2 rounded flex justify-between items-center mb-2"
          >
            {c.name}

            <div className="flex gap-4">
              {/* EDIT */}
              <button
                className="text-blue-600"
                onClick={() => editCategory(c._id, c.name)}
              >
                Edit
              </button>

              {/* DELETE */}
              <button
                className="text-red-600"
                onClick={() => remove(c._id)}
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
