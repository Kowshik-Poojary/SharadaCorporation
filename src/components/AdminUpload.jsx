import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminUpload() {
  const [products, setProducts] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [files, setFiles] = useState([]);

  useEffect(() => {
  axios.get("/api/products").then(res => {
    console.log("API response:", res.data);
    setProducts(Array.isArray(res.data) ? res.data : []);
  });
}, []);


  const uploadImages = async () => {
    if (!selectedId) return alert("Select a product first.");
    if (files.length === 0) return alert("Select images first.");

    const form = new FormData();
    for (let file of files) {
      form.append("images", file);
    }

    const res = await axios.post(`/api/upload/${selectedId}`, form, {
      headers: { "Content-Type": "multipart/form-data" }
    });

    alert("Uploaded!\n" + JSON.stringify(res.data.imageUrls, null, 2));
  };

  return (
    <div className="p-8">
      <h2 className="text-xl font-semibold mb-4">Upload Product Images</h2>

      <select className="border p-2" onChange={e => setSelectedId(e.target.value)}>
  <option>Select Product</option>

  {Array.isArray(products) &&
    products.map((p) => (
      <option key={p._id} value={p._id}>
        {p.name} ({p.category})
      </option>
    ))}
</select>


      <input
        type="file"
        multiple
        className="block mt-4"
        onChange={e => setFiles(e.target.files)}
      />

      <button
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
        onClick={uploadImages}
      >
        Upload Images
      </button>
    </div>
  );
}
