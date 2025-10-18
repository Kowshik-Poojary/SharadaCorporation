import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedSizes, setSelectedSizes] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(err => console.error(err));
  }, [id]);

  const toggleSize = (size) => {
    setSelectedSizes(prev =>
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const handleEnquiry = () => {
    axios.post("http://localhost:5000/api/enquiry", {
      userId: "user123", // Replace with logged-in user
      products: selectedSizes.map(size => ({ productId: id, size })),
    }).then(res => alert(res.data.message));
  };

  const handleWishlist = () => {
    axios.post("http://localhost:5000/api/wishlist", {
      userId: "user123",
      productId: id
    }).then(res => alert(res.data.message));
  };

  if (!product) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row gap-6">
        <img src={product.imageUrl} alt={product.name} className="w-full md:w-1/3 rounded" />
        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-gray-500 mb-4">{product.category}</p>

          <h2 className="text-xl font-semibold mb-2">Available Sizes:</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {product.sizes.map(size => (
              <label key={size} className="flex items-center gap-2 border p-2 rounded cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedSizes.includes(size)}
                  onChange={() => toggleSize(size)}
                />
                {size}
              </label>
            ))}
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleEnquiry}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Add to Enquiry
            </button>
            <button
              onClick={handleWishlist}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Add to Wishlist
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
