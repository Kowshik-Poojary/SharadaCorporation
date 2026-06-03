import React, { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function ProductCatalogue() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  // Pagination States
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 20; // Match the backend limit

  const { categoryName = "New Arrival" } = useParams();
  const navigate = useNavigate();

  // Helper function to force Cloudinary to compress and resize images dynamically
  const optimizeCloudinaryUrl = (url) => {
    if (!url || !url.includes("cloudinary.com"))
      return url || "/placeholder.webp";
    // Inserts optimization parameters right after '/upload/' in the Cloudinary URL
    // w_300: forces width to 300px, q_auto: automated smart compression, f_auto: delivers WebP/AVIF if supported
    return url.replace(
      "/upload/",
      "/upload/w_300,h_400,c_fill,g_auto,q_auto,f_auto/",
    );
  };

  useEffect(() => {
    axios
      .get("/api/products/all/list")
      .then((res) => setCategories(res.data))
      .catch(() => setCategories([]));
  }, []);

  // Reset page to 1 whenever user switches categories
  useEffect(() => {
    setPage(1);
  }, [categoryName]);

  // Fetch products based on categoryName AND current page
  useEffect(() => {
    axios
      .get(`/api/products/category/${categoryName}?page=${page}&limit=${limit}`)
      .then((res) => {
        setProducts(res.data.products);
        setTotalPages(res.data.totalPages);
      })
      .catch(console.error);
  }, [categoryName, page]);

  return (
    <div className="flex flex-col md:flex-row">
      {/* MOBILE HORIZONTAL CATEGORIES */}
      <div className="md:hidden bg-gray-100 p-3 overflow-x-auto whitespace-nowrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => navigate(`/products/catalogue/${cat}`)}
            className={`px-4 py-2 mr-3 rounded-full border ${
              cat === categoryName ? "bg-blue-600 text-white" : "bg-white"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:block w-64 bg-gray-100 p-4 h-screen sticky top-20 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Categories</h2>
        <ul className="space-y-2">
          {categories.map((cat) => (
            <li key={cat}>
              <button
                onClick={() => navigate(`/products/catalogue/${cat}`)}
                className={`w-full p-2 rounded text-left ${
                  cat === categoryName ? "bg-blue-600 text-white" : "bg-white"
                }`}
              >
                {cat}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* PRODUCTS GRID */}
      <main className="flex-1 p-4 md:p-6 flex flex-col justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-6">{categoryName}</h1>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
            {products.map((p) => {
              const rawImage =
                p.imageUrl ||
                p.variants?.[0]?.imageUrl ||
                p.variants?.[0]?.data?.imageUrl;

              return (
                <Link
                  key={p._id}
                  to={`/products/details/${p._id}`}
                  className="bg-white p-3 shadow rounded-lg hover:scale-105 transition"
                >
                  <img
                    src={optimizeCloudinaryUrl(rawImage)}
                    className="h-32 sm:h-40 w-full object-cover rounded"
                    alt={p.name}
                    loading="lazy" // Native browser lazy loading to save bandwidth
                  />
                  <h2 className="mt-2 text-sm sm:text-lg font-semibold">
                    {p.name}
                  </h2>
                  <p className="text-gray-500 text-sm">{p.category}</p>
                </Link>
              );
            })}
          </div>
        </div>

        {/* --- PAGINATION CONTROLS --- */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-4 mt-12 py-4 border-t">
            <button
              disabled={page === 1}
              onClick={() => setPage((prev) => prev - 1)}
              className="px-4 py-2 border rounded shadow disabled:opacity-40 disabled:cursor-not-allowed bg-white hover:bg-gray-50"
            >
              Previous
            </button>
            <span className="text-gray-700 font-medium">
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((prev) => prev - 1 + 2)}
              className="px-4 py-2 border rounded shadow disabled:opacity-40 disabled:cursor-not-allowed bg-white hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
