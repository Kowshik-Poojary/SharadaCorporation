import React, { useEffect, useState } from "react";
import axios from "axios";

export default function WishlistPage() {
  const user = typeof window !== "undefined" && JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (!userId) return;
    axios.get(`/api/wishlist/${userId}`).then((res) => {
      setItems(res.data);
    }).catch(console.error);
  }, [userId]);

  const handleRemove = async (variantCode, productId) => {
    try {
      await axios.post("/api/wishlist/remove", { userId, productId, variantCode });
      setItems(items.filter(i => i.variantCode !== variantCode || i.productId !== productId));
    } catch (err) {
      console.error(err);
      alert("Could not remove");
    }
  };

  if (!userId) return <div className="p-6">Please login to view your wishlist.</div>;

  if (!items.length) return <div className="p-6">Your wishlist is empty.</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">My Wishlist</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map(item => (
          <div key={`${item.productId}-${item.variantCode}`} className="border p-4 rounded shadow">
            <img src={`https://res.cloudinary.com/<cloud_name>/image/upload/sharda/variants/${item.variantCode}.jpg`}
                 alt={item.variantCode}
                 className="w-full h-40 object-contain mb-3" onError={(e)=>e.target.src="/placeholder.webp"} />
            <p className="font-semibold">Variant: {item.variantCode}</p>
            <p className="text-sm text-gray-600">Product ID: {item.productId}</p>
            <button className="mt-3 bg-red-500 text-white px-3 py-1 rounded" onClick={() => handleRemove(item.variantCode, item.productId)}>
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
