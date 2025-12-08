import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function ProductCatalogue() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  const { categoryName = "New Arrival" } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/api/products/categories/list")
      .then((res) => setCategories(res.data))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    axios
      .get(`/api/products/category/${categoryName}`)
      .then((res) => setProducts(res.data))
      .catch(console.error);
  }, [categoryName]);

  return (
    <div className="flex flex-col md:flex-row">
      {/* MOBILE HORIZONTAL CATEGORIES */}
      <div className="md:hidden bg-gray-100 p-3 overflow-x-auto whitespace-nowrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => navigate(`/products/catalogue/${cat}`)}
            className={`px-4 py-2 mr-3 rounded-full border 
              ${cat === categoryName ? "bg-blue-600 text-white" : "bg-white"}`}
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
                className={`w-full p-2 rounded text-left 
                  ${
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
      <main className="flex-1 p-4 md:p-6">
        <h1 className="text-2xl font-bold mb-6">{categoryName}</h1>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
          {products.map((p) => (
            <Link
              key={p._id}
              to={`/products/details/${p._id}`}
              className="bg-white p-3 shadow rounded-lg hover:scale-105 transition"
            >
              <img
                src={
                  p.imageUrl ||
                  p.variants?.[0]?.imageUrl ||
                  p.variants?.[0]?.data?.imageUrl ||
                  "/placeholder.webp"
                }
                className="h-32 sm:h-40 w-full object-cover rounded"
                alt={p.name}
              />

              <h2 className="mt-2 text-sm sm:text-lg font-semibold">
                {p.name}
              </h2>
              <p className="text-gray-500 text-sm">{p.category}</p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
