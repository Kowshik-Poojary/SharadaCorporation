import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import AdminLayout from "./AdminLayout";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = () => {
    axios.get("/api/admin/products").then((res) => setProducts(res.data));
  };

  /* ---------------- DELETE PRODUCT ---------------- */
  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    await axios.delete(`/api/admin/products/${id}`);
    loadProducts();
  };

  /* ---------------- DELETE VARIANT ---------------- */
  const deleteVariant = async (pid, vid) => {
    if (!window.confirm("Delete variant?")) return;
    await axios.delete(`/api/admin/products/${pid}/variants/${vid}`);
    loadProducts();
  };

  /* -------------- UPDATE VARIANT INLINE ------------ */
  const updateVariant = async (pid, vid, updated) => {
    await axios.put(`/api/admin/products/${pid}/variants/${vid}`, updated);
    loadProducts();
  };

  /* ---------------- SAVE PRODUCT EDIT ---------------- */
  const saveEdit = async () => {
    await axios.put(`/api/admin/products/${editing._id}`, editing);
    setEditing(null);
    loadProducts();
  };

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6">Manage Products</h1>

      {/* Buttons */}
      <div className="flex gap-4 mb-4">
        <Link to="/admin/products/new" className="bg-blue-600 text-white px-4 py-2 rounded">
          + Add Product
        </Link>

        <Link to="/admin/products/add-variant" className="bg-green-600 text-white px-4 py-2 rounded">
          + Add Variant
        </Link>
      </div>

      <table className="w-full bg-white border rounded shadow">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Category</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.map((p) => (
            <React.Fragment key={p._id}>
              <tr>
                <td className="border p-2">{p.name}</td>
                <td className="border p-2">{p.category}</td>
                <td className="border p-2 space-x-3">

                  {/* Expand */}
                  <button
                    className="text-green-700"
                    onClick={() => setExpanded(expanded === p._id ? null : p._id)}
                  >
                    Variants ▾
                  </button>

                  {/* Edit */}
                  <button
                    className="text-blue-600"
                    onClick={() => setEditing(p)}
                  >
                    Edit
                  </button>

                  {/* Delete */}
                  <button
                    className="text-red-600"
                    onClick={() => deleteProduct(p._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>

              {/* ---------------- VARIANT LIST ---------------- */}
              {expanded === p._id && (
                <tr>
                  <td colSpan="3" className="bg-gray-50 p-4">

                    <h2 className="text-lg font-bold mb-3">
                      Variants of {p.name}
                    </h2>

                    {p.variants.map((v) => (
                      <div key={v._id} className="bg-white border p-3 mb-3 rounded shadow-sm">

                        {/* Edit Code */}
                        <label className="font-semibold">Code:</label>
                        <input
                          className="border p-1 ml-2"
                          defaultValue={v.code}
                          onBlur={(e) =>
                            updateVariant(p._id, v._id, { code: e.target.value })
                          }
                        />

                        {/* Fields */}
                        <pre className="bg-gray-100 p-3 rounded mt-2 text-sm">
                          {JSON.stringify(v.data, null, 2)}
                        </pre>

                        {/* Image */}
                        {v.imageUrl && (
                          <img
                            src={v.imageUrl}
                            className="h-20 mt-2 border rounded"
                          />
                        )}

                        <button
                          onClick={() => deleteVariant(p._id, v._id)}
                          className="mt-2 bg-red-600 text-white px-3 py-1 rounded"
                        >
                          Delete Variant
                        </button>
                      </div>
                    ))}

                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      {/* ---------------- EDIT PRODUCT MODAL ---------------- */}
      {editing && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 w-96 rounded shadow-xl space-y-4">

            <h2 className="text-xl font-bold">Edit Product</h2>

            <input
              className="border p-2 w-full"
              value={editing.name}
              onChange={(e) => setEditing({ ...editing, name: e.target.value })}
            />

            <input
              className="border p-2 w-full"
              value={editing.category}
              onChange={(e) =>
                setEditing({ ...editing, category: e.target.value })
              }
            />

            <textarea
              className="border p-2 w-full"
              value={editing.description}
              onChange={(e) =>
                setEditing({ ...editing, description: e.target.value })
              }
            />

            <div className="flex justify-end gap-3">
              <button onClick={() => setEditing(null)} className="px-4 py-2 bg-gray-300 rounded">
                Cancel
              </button>

              <button onClick={saveEdit} className="px-4 py-2 bg-blue-600 text-white rounded">
                Save
              </button>
            </div>

          </div>
        </div>
      )}
    </AdminLayout>
  );
}
