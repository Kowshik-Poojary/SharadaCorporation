import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminLayout from "./AdminLayout";

export default function AdminAddProduct() {
  const [categories, setCategories] = useState([]);
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("");

  const [variants, setVariants] = useState([
    {
      code: "",
      image: null,
      columns: [{ key: "Code #", value: "" }]
    }
  ]);

  useEffect(() => {
    axios
      .get("/api/admin/categories/all/list")
      .then((res) => setCategories(res.data))
      .catch(() => setCategories([]));
  }, []);

  const addVariant = () => {
    const firstCols = variants[0].columns.map((c) => ({
      key: c.key,
      value: ""
    }));

    setVariants([...variants, { code: "", image: null, columns: firstCols }]);
  };

  const addColumn = () => {
    const newKey = prompt("Enter column name:");
    if (!newKey || newKey.trim() === "Code #") return;

    setVariants((prev) =>
      prev.map((v) => ({
        ...v,
        columns: [...v.columns, { key: newKey, value: "" }]
      }))
    );
  };

  const saveProduct = async () => {
    if (!productName || !category) return alert("Fill all fields");

    const form = new FormData();

    form.append("name", productName);
    form.append("category", category);

    variants.forEach((v, idx) => {
      // CODE
      form.append(`variants.${idx}.code`, v.code);
      

      // COLUMNS
      v.columns.forEach((col) => {
        const value = col.key === "Code #" ? v.code : col.value;
        form.append(`variants.${idx}.data.${col.key}`, value);
      });

      // IMAGE
      if (v.image) {
        form.append(`variants.${idx}.image`, v.image);
      }
    });

    try {
      await axios.post("/api/admin/products/add-with-variants", form, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      alert("Product added successfully!");
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Error adding product");
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-3xl mb-6">Add New Product</h1>

      <select
        className="border p-2 w-full mb-4 text-black"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="">Select Category</option>
        {categories.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <input
        className="border p-2 w-full mb-4"
        placeholder="Product Name"
        value={productName}
        onChange={(e) => setProductName(e.target.value)}
      />

      <button
        onClick={addVariant}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        + Add Variant
      </button>

      <button
        onClick={addColumn}
        className="ml-2 bg-blue-600 text-white px-4 py-2 rounded"
      >
        + Add Column
      </button>

      <div className="mt-6 space-y-6">
        {variants.map((v, i) => (
          <div key={i} className="p-4 border rounded bg-white shadow">
            <h2 className="text-xl font-semibold">Variant {i + 1}</h2>

            <input
              className="border p-2 w-full mt-2"
              placeholder="Code"
              value={v.code}
              onChange={(e) => {
                const copy = [...variants];
                const val = e.target.value;

                copy[i].code = val;
                const codeCol = copy[i].columns.find((c) => c.key === "Code #");
                if (codeCol) codeCol.value = val;

                setVariants(copy);
              }}
            />

            <input
              type="file"
              accept="image/*"
              className="mt-2"
              onChange={(e) => {
                const copy = [...variants];
                copy[i].image = e.target.files[0];
                setVariants(copy);
              }}
            />

            {v.columns.map((col, cIdx) => (
              <div key={cIdx} className="flex gap-3 mt-3">
                <input
                  className="border p-2 w-1/3"
                  value={col.key}
                  disabled={i !== 0 || col.key === "Code #"}
                  onChange={(e) => {
                    const copy = [...variants];
                    copy.forEach((v) => (v.columns[cIdx].key = e.target.value));
                    setVariants(copy);
                  }}
                />

                <input
                  className="border p-2 w-2/3"
                  placeholder="Value"
                  value={col.key === "Code #" ? v.code : col.value}
                  disabled={col.key === "Code #"}
                  onChange={(e) => {
                    const copy = [...variants];
                    copy[i].columns[cIdx].value = e.target.value;
                    setVariants(copy);
                  }}
                />
              </div>
            ))}
          </div>
        ))}
      </div>

      <button
        onClick={saveProduct}
        className="mt-6 bg-purple-600 text-white px-6 py-3 rounded"
      >
        Save Product
      </button>
    </AdminLayout>
  );
}
