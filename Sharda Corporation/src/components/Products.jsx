import React, { useEffect, useState } from "react";
import axios from "axios";

const Products = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Our Products</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((p) => (
          <div key={p._id} className="bg-white p-4 shadow rounded-lg">
            <img src={p.imageUrl} alt={p.name} className="h-40 w-full object-cover rounded" />
            <h2 className="mt-2 text-lg font-semibold">{p.name}</h2>
            <p className="text-gray-500">{p.category}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
