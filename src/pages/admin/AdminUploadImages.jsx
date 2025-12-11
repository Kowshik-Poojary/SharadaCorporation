import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import AdminLayout from "./AdminLayout";
import LoadingBar from "react-top-loading-bar";
import toast, { Toaster } from "react-hot-toast";

export default function AdminUploadImages() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [variants, setVariants] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");

  const [uploadingId, setUploadingId] = useState(null); // which variant is uploading

  const loaderRef = useRef(null);

  /* ------------------ LOAD CATEGORIES ------------------ */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        loaderRef.current.continuousStart();
        const res = await axios.get("/api/admin/categories/all/list");
        setCategories(res.data);
        loaderRef.current.complete();
      } catch {
        loaderRef.current.complete();
        toast.error("Failed to load categories.");
      }
    };

    fetchCategories();
  }, []);

  /* ------------------ LOAD PRODUCTS ------------------ */
  const loadProducts = async (cat) => {
    setSelectedProduct("");
    setVariants([]);

    try {
      loaderRef.current.continuousStart();
      const res = await axios.get(`/api/admin/products/category/${cat}`);
      setProducts(res.data);
      loaderRef.current.complete();
    } catch {
      loaderRef.current.complete();
      toast.error("Failed to load products.");
    }
  };

  /* ------------------ LOAD VARIANTS ------------------ */
  const loadVariants = async (productId) => {
    try {
      loaderRef.current.continuousStart();
      const res = await axios.get(`/api/admin/products/${productId}`);
      setVariants(res.data.variants || []);
      loaderRef.current.complete();
    } catch {
      loaderRef.current.complete();
      toast.error("Failed to load variants.");
    }
  };

  /* ------------------ UPLOAD IMAGE ------------------ */
  const uploadImage = async (variantId, file) => {
    if (!file) return;

    try {
      setUploadingId(variantId);
      loaderRef.current.continuousStart();

      const form = new FormData();
      form.append("image", file);

      await axios.post(
        `/api/admin/products/${selectedProduct}/variant/${variantId}/image`,
        form,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      toast.success("Image uploaded successfully!");
      await loadVariants(selectedProduct);

      setUploadingId(null);
      loaderRef.current.complete();
    } catch {
      toast.error("Upload failed!");
      setUploadingId(null);
      loaderRef.current.complete();
    }
  };

  return (
    <AdminLayout>
      {/* Loader & Toast */}
      <LoadingBar ref={loaderRef} color="#facc15" height={4} />
      <Toaster position="top-center" />

      <h1 className="text-2xl font-bold mb-6">Upload / Replace Variant Images</h1>

      {/* CATEGORY SELECT */}
      <select
        className="border p-2 rounded w-full md:w-1/2 mb-4"
        value={selectedCategory}
        onChange={(e) => {
          setSelectedCategory(e.target.value);
          loadProducts(e.target.value);
        }}
      >
        <option value="">Select Category</option>
        {categories.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>

      {/* PRODUCT SELECT */}
      <select
        className="border p-2 rounded w-full md:w-1/2 mb-4"
        value={selectedProduct}
        disabled={!selectedCategory}
        onChange={(e) => {
          setSelectedProduct(e.target.value);
          loadVariants(e.target.value);
        }}
      >
        <option value="">Select Product</option>
        {products.map((p) => (
          <option key={p._id} value={p._id}>{p.name}</option>
        ))}
      </select>

      {/* VARIANTS LIST */}
      {variants.length > 0 && (
        <div className="space-y-4 mt-6">
          {variants.map((v) => (
            <div
              key={v._id}
              className="border p-4 bg-white rounded shadow flex items-center gap-6"
            >
              <div>
                <strong>Code:</strong> {v.code}
              </div>

              {/* Current image */}
              <div>
                {v.imageUrl ? (
                  <img
                    src={v.imageUrl}
                    className="w-24 h-24 object-cover border rounded"
                  />
                ) : (
                  <div className="w-24 h-24 flex items-center justify-center border rounded text-gray-500">
                    No Image
                  </div>
                )}
              </div>

              {/* Upload input */}
              <div>
                <input
                  type="file"
                  accept="image/*"
                  disabled={uploadingId === v._id}
                  onChange={(e) => uploadImage(v._id, e.target.files[0])}
                  className={`${
                    uploadingId === v._id ? "cursor-wait opacity-60" : ""
                  }`}
                />

                {uploadingId === v._id && (
                  <p className="text-sm text-yellow-600 mt-1">Uploading...</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
