import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import AdminLayout from "./AdminLayout";
import SearchSelect from "../../components/SearchSelect";
import LoadingBar from "react-top-loading-bar";
import toast, { Toaster } from "react-hot-toast";

export default function AdminAddVariant() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");

  const [existingColumns, setExistingColumns] = useState([]);
  const [variants, setVariants] = useState([
    { code: "", image: null, columns: [{ key: "Code #", value: "" }] },
  ]);

  const loaderRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  /* LOAD CATEGORIES */
  useEffect(() => {
    axios
      .get("/api/admin/categories/all/list")
      .then((res) => setCategories(res.data))
      .catch(() => setCategories([]));
  }, []);

  /* LOAD PRODUCTS WHEN CATEGORY SELECTED */
  const loadProducts = async (categoryName) => {
    try {
      loaderRef.current.continuousStart();
      const res = await axios.get(`/api/admin/products/category/${categoryName}`);
      setProducts(res.data);
      loaderRef.current.complete();
    } catch {
      toast.error("Failed to load products.");
      loaderRef.current.complete();
    }
  };

  /* WHEN PRODUCT SELECTED → LOAD COLUMN STRUCTURE */
  const handleProductSelect = async (productId) => {
    setSelectedProduct(productId);

    try {
      loaderRef.current.continuousStart();
      const res = await axios.get(`/api/admin/products/${productId}`);
      const product = res.data;

      if (product.variants.length > 0) {
        const keys = Object.keys(product.variants[0].data || {});
        setExistingColumns(keys);

        setVariants([
          {
            code: "",
            image: null,
            columns: keys.map((key) => ({ key, value: "" })),
          },
        ]);
      } else {
        setExistingColumns(["Code #"]);
        setVariants([
          { code: "", image: null, columns: [{ key: "Code #", value: "" }] },
        ]);
      }

      loaderRef.current.complete();
    } catch {
      toast.error("Failed to load product details.");
      loaderRef.current.complete();
    }
  };

  /* ADD VARIANT */
  const addVariant = () => {
    const newCols = existingColumns.map((key) => ({ key, value: "" }));
    setVariants([...variants, { code: "", image: null, columns: newCols }]);
  };

  /* SAVE VARIANTS */
  const saveVariants = async () => {
    if (!selectedProduct) return toast.error("Select a product first!");

    try {
      setIsLoading(true);
      loaderRef.current.continuousStart();

      const form = new FormData();
      form.append("productId", selectedProduct);

      variants.forEach((v, idx) => {
        form.append(`variants.${idx}.code`, v.code);

        v.columns.forEach((c) => {
          const value = c.key === "Code #" ? v.code : c.value;
          form.append(`variants.${idx}.data.${c.key}`, value);
        });

        if (v.image) {
          form.append(`variants.${idx}.image`, v.image);
        }
      });

      await axios.post("/api/admin/products/add-variants", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Variants added successfully!");
      loaderRef.current.complete();

      setTimeout(() => window.location.reload(), 800);
    } catch (err) {
      console.error(err);
      toast.error("Error adding variants.");
      loaderRef.current.complete();
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout>
      {/* Loader + Toast */}
      <LoadingBar ref={loaderRef} color="#facc15" height={4} />
      <Toaster position="top-center" />

      <h1 className="text-3xl font-bold mb-4">Add Variant(s)</h1>

      {/* CATEGORY DROPDOWN */}
      <SearchSelect
        label="Select Category"
        options={categories.map((c) => ({ label: c.trim(), value: c.trim() }))}
        value={selectedCategory}
        onChange={(val) => {
          setSelectedCategory(val);
          loadProducts(val);
        }}
      />

      {/* PRODUCT DROPDOWN */}
      <SearchSelect
        label="Select Product"
        options={products.map((p) => ({ label: p.name, value: p._id }))}
        value={selectedProduct}
        onChange={handleProductSelect}
      />

      <button
        onClick={addVariant}
        className="bg-green-600 text-white px-4 py-2 rounded mb-4"
      >
        + Add Variant
      </button>

      {variants.map((v, idx) => (
        <div key={idx} className="border p-4 bg-white rounded shadow mb-4">
          <h2 className="text-lg font-semibold">Variant {idx + 1}</h2>

          <input
            className="border p-2 w-full mt-2"
            placeholder="Variant Code"
            value={v.code}
            onChange={(e) => {
              const updated = [...variants];
              updated[idx].code = e.target.value;

              const codeCol = updated[idx].columns.find((c) => c.key === "Code #");
              if (codeCol) codeCol.value = e.target.value;

              setVariants(updated);
            }}
          />

          <input
            type="file"
            accept="image/*"
            className="mt-2"
            onChange={(e) => {
              const updated = [...variants];
              updated[idx].image = e.target.files[0];
              setVariants(updated);
            }}
          />

          {v.columns.map((col, cidx) => (
            <div key={cidx} className="flex gap-3 mt-3">
              <input className="border p-2 w-1/3" value={col.key} disabled />
              <input
                className="border p-2 w-2/3"
                placeholder="Value"
                value={col.key === "Code #" ? v.code : col.value}
                disabled={col.key === "Code #"}
                onChange={(e) => {
                  const updated = [...variants];
                  updated[idx].columns[cidx].value = e.target.value;
                  setVariants(updated);
                }}
              />
            </div>
          ))}
        </div>
      ))}

      <button
        onClick={saveVariants}
        disabled={isLoading}
        className={`mt-6 px-6 py-3 rounded text-white font-semibold transition ${
          isLoading ? "bg-purple-400 cursor-wait" : "bg-purple-600 hover:bg-purple-700"
        }`}
      >
        {isLoading ? "Saving Variants..." : "Save Variants"}
      </button>
    </AdminLayout>
  );
}
