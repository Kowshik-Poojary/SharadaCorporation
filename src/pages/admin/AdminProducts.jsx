import React, { useEffect, useState } from "react";
import axios from "../../utils/axiosInstance";
import { Link, useSearchParams } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "../../main";

const fetchAdminProducts = async (page, limit) => {
  const res = await axios.get(
    `/api/admin/products?page=${page}&limit=${limit}`,
  );

  return res.data;
};

export default function AdminProducts() {
  // const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [expanded, setExpanded] = useState(null);

  const limit = 10;

  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page")) || 1;

  const handlePageChange = (newPageNumber) => {
    searchParams.set("page", newPageNumber);
    setSearchParams(searchParams);
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-products", page],
    queryFn: () => fetchAdminProducts(page, limit),
    placeholderData: keepPreviousData,
  });

  const products = data?.products || [];
  const totalPages = data?.totalPages || 1;

  // useEffect(() => {
  //   loadProducts();
  // }, []);

  // const loadProducts = () => {
  //   axios.get("/api/admin/products").then((res) => setProducts(res.data));
  // };

  /* ---------------- DELETE PRODUCT ---------------- */
  // const deleteProduct = async (id) => {
  //   if (!window.confirm("Delete this product?")) return;
  //   await axios.delete(`/api/admin/products/${id}`);
  //   loadProducts();
  // };

  // /* ---------------- DELETE VARIANT ---------------- */
  // const deleteVariant = async (pid, vid) => {
  //   if (!window.confirm("Delete variant?")) return;
  //   await axios.delete(`/api/admin/products/${pid}/variants/${vid}`);
  //   loadProducts();
  // };

  // /* -------------- UPDATE VARIANT INLINE ------------ */
  // const updateVariant = async (pid, vid, updated) => {
  //   await axios.put(`/api/admin/products/${pid}/variants/${vid}`, updated);
  //   loadProducts();
  // };

  // /* ---------------- SAVE PRODUCT EDIT ---------------- */
  // const saveEdit = async () => {
  //   await axios.put(`/api/admin/products/${editing._id}`, editing);
  //   setEditing(null);
  //   loadProducts();
  // };

  const deleteProductMutation = useMutation({
    mutationFn: (id) => axios.delete(`/api/admin/products/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    },
  });

  const deleteVariantMutation = useMutation({
    mutationFn: ({ pid, vid }) =>
      axios.delete(`/api/admin/products/${pid}/variants/${vid}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    },
  });

  const updateVariantMutation = useMutation({
    mutationFn: ({ pid, vid, updated }) =>
      axios.put(`/api/admin/products/${pid}/variants/${vid}`, updated),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    },
  });

  const saveProductEditMutation = useMutation({
    mutationFn: (updatedProduct) =>
      axios.put(`/api/admin/products/${updatedProduct._id}`, updatedProduct),
    onSuccess: () => {
      setEditing(null);
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    },
  });

  const handleDeleteProduct = (id) => {
    if (window.confirm("Permanently delete this product profile?")) {
      deleteProductMutation.mutate(id);
    }
  };

  const handleDeleteVariant = (pid, vid) => {
    if (
      window.confirm(
        "Permanently strip away this specific component item variant?",
      )
    ) {
      deleteVariantMutation.mutate({ pid, vid });
    }
  };

  if (isLoading)
    return (
      <AdminLayout>
        <div className="text-center p-10 font-semibold text-gray-600">
          Syncing table data records...
        </div>
      </AdminLayout>
    );
  if (isError)
    return (
      <AdminLayout>
        <div className="text-center p-10 text-red-500 font-semibold">
          Error displaying data table elements.
        </div>
      </AdminLayout>
    );

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6">Manage Products</h1>

      {/* Navigation Triggers */}
      <div className="flex gap-4 mb-4">
        <Link
          to="/admin/products/new"
          className="bg-blue-600 text-white px-4 py-2 rounded font-medium hover:bg-blue-700 transition"
        >
          + Add Product
        </Link>
        <Link
          to="/admin/products/add-variant"
          className="bg-green-600 text-white px-4 py-2 rounded font-medium hover:bg-green-700 transition"
        >
          + Add Variant
        </Link>
      </div>

      <div className="bg-white border rounded shadow overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-200 border-b">
            <tr>
              <th className="p-3 font-semibold text-gray-700">Name</th>
              <th className="p-3 font-semibold text-gray-700">Category</th>
              <th className="p-3 font-semibold text-gray-700 text-center">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {products.map((p) => (
              <React.Fragment key={p._id}>
                <tr className="border-b hover:bg-gray-50 transition">
                  <td className="p-3 font-medium text-gray-800">{p.name}</td>
                  <td className="p-3 text-gray-600">{p.category}</td>
                  <td className="p-3 space-x-4 text-center">
                    <button
                      className="text-green-700 font-semibold hover:underline"
                      onClick={() =>
                        setExpanded(expanded === p._id ? null : p._id)
                      }
                    >
                      Variants {expanded === p._id ? "▲" : "▾"}
                    </button>
                    <button
                      className="text-blue-600 font-semibold hover:underline"
                      onClick={() => setEditing(p)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-600 font-semibold hover:underline"
                      onClick={() => handleDeleteProduct(p._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>

                {/* ---------------- DRAW EXTENDED EXPANDED VARIANTS ---------------- */}
                {expanded === p._id && (
                  <tr>
                    <td colSpan="3" className="bg-gray-50 p-4 border-b">
                      <h2 className="text-md font-bold mb-3 text-gray-700">
                        Variants of {p.name} ({p.variants?.length || 0})
                      </h2>

                      {!p.variants || p.variants.length === 0 ? (
                        <p className="text-sm text-gray-500 italic">
                          No design profiles saved against this identifier.
                        </p>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {p.variants.map((v) => (
                            <div
                              key={v._id}
                              className="bg-white border p-3 rounded shadow-sm flex flex-col justify-between"
                            >
                              <div>
                                <div className="mb-2">
                                  <label className="font-semibold text-sm text-gray-600">
                                    SKU Code:
                                  </label>
                                  <input
                                    className="border p-1 text-sm ml-2 rounded focus:outline-blue-500"
                                    defaultValue={v.code}
                                    onBlur={(e) =>
                                      updateVariantMutation.mutate({
                                        pid: p._id,
                                        vid: v._id,
                                        updated: { code: e.target.value },
                                      })
                                    }
                                  />
                                </div>

                                <pre className="bg-gray-100 p-2 rounded text-xs text-gray-600 overflow-x-auto max-h-24">
                                  {JSON.stringify(v.data, null, 2)}
                                </pre>

                                {v.imageUrl && (
                                  <img
                                    src={v.imageUrl}
                                    className="h-20 w-20 object-cover mt-2 border rounded shadow-sm"
                                    alt="Variant Profile Look"
                                  />
                                )}
                              </div>

                              <button
                                onClick={() =>
                                  handleDeleteVariant(p._id, v._id)
                                }
                                className="mt-3 text-xs bg-red-100 border border-red-300 text-red-700 px-3 py-1.5 rounded hover:bg-red-200 transition self-start"
                              >
                                Delete Variant
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>

        {/* --- PAGINATION CONTROL LAYER CONTAINER --- */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-4 py-4 bg-gray-50 border-t">
            <button
              disabled={page === 1}
              onClick={() => handlePageChange(page - 1)}
              className="px-4 py-1.5 border text-sm font-medium rounded shadow-sm disabled:opacity-40 disabled:cursor-not-allowed bg-white hover:bg-gray-50 transition"
            >
              Previous
            </button>
            <span className="text-gray-600 text-sm font-medium">
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page === totalPages}
              onClick={() => handlePageChange(page + 1)}
              className="px-4 py-1.5 border text-sm font-medium rounded shadow-sm disabled:opacity-40 disabled:cursor-not-allowed bg-white hover:bg-gray-50 transition"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* ---------------- ACTIONS SYSTEM INTERCEPT: EDIT MODAL WINDOW ---------------- */}
      {editing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 w-full max-w-md rounded-lg shadow-2xl space-y-4">
            <h2 className="text-xl font-bold text-gray-800">
              Edit Base Product Details
            </h2>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                Product Name
              </label>
              <input
                className="border p-2 w-full rounded focus:outline-blue-500"
                value={editing.name}
                onChange={(e) =>
                  setEditing({ ...editing, name: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                Category Route Mapping
              </label>
              <input
                className="border p-2 w-full rounded focus:outline-blue-500"
                value={editing.category}
                onChange={(e) =>
                  setEditing({ ...editing, category: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                Description Meta Details
              </label>
              <textarea
                className="border p-2 w-full rounded h-24 resize-none focus:outline-blue-500"
                value={editing.description || ""}
                onChange={(e) =>
                  setEditing({ ...editing, description: e.target.value })
                }
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setEditing(null)}
                className="px-4 py-2 bg-gray-200 font-medium text-gray-700 rounded hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => saveProductEditMutation.mutate(editing)}
                className="px-4 py-2 bg-blue-600 font-medium text-white rounded hover:bg-blue-700 transition"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
