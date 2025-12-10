import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "./AdminLayout";

export default function AdminUploadImages() {
  const [products, setProducts] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    axios.get("/api/admin/products").then((res) => setProducts(res.data));
  }, []);

  const upload = async () => {
    if (!selectedId) return alert("Please select a product.");
    if (!files.length) return alert("Please select image files.");

    const form = new FormData();
    files.forEach((f) => form.append("images", f));

    try {
      setUploading(true);
      await axios.post(`/api/admin/uploads/${selectedId}`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Uploaded successfully!");
    } finally {
      setUploading(false);
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4">Upload Product Images</h1>

      <select
        className="border p-2 rounded w-full md:w-1/2"
        onChange={(e) => setSelectedId(e.target.value)}
      >
        <option>Select Product</option>
        {products.map((p) => (
          <option key={p._id} value={p._id}>
            {p.name} ({p.category})
          </option>
        ))}
      </select>

      <input
        type="file"
        multiple
        className="mt-4"
        onChange={(e) => setFiles([...e.target.files])}
      />

      <button
        className={`mt-4 px-5 py-2 rounded text-white ${
          uploading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
        }`}
        onClick={upload}
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>
    </AdminLayout>
  );
}
