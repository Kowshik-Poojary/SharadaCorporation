import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function WishlistPage() {
  const navigate = useNavigate();
  const user = typeof window !== "undefined" && JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;

  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    if (!userId) return;
    axios
      .get(`/api/wishlist/${userId}`)
      .then((res) => setItems(res.data))
      .catch(console.error);
  }, [userId]);

  const toggleSelect = (item) => {
    const key = item.productId + "-" + item.variantCode;

    setSelected((prev) =>
      prev.includes(key)
        ? prev.filter((k) => k !== key)
        : [...prev, key]
    );
  };

  const handleRemove = async (variantCode, productId) => {
    try {
      await axios.post("/api/wishlist/remove", { userId, productId, variantCode });

      setItems(items.filter(
        (i) => !(i.variantCode === variantCode && i.productId === productId)
      ));
    } catch (err) {
      console.error(err);
      alert("Could not remove");
    }
  };

  if (!userId)
    return <div className="p-6">Please login to view your wishlist.</div>;

  if (!items.length)
    return <div className="p-6">Your wishlist is empty.</div>;

  // Build enquiry email text
  const buildEmail = () => {
    let message = `Hello,\n\nI would like to enquire about the following products:\n\n`;

    selected.forEach((key) => {
      const item = items.find(
        (i) => key === i.productId + "-" + i.variantCode
      );

      if (!item) return;

      message += `📌 Product: ${item.productName}\n`;
      message += `🔸 Variant Code: ${item.variantCode}\n`;

      Object.entries(item.variantDetails || {}).forEach(([k, v]) => {
        message += `   - ${k}: ${v}\n`;
      });

      message += `\n`;
    });

    message += `Thank you.\n`;

    return encodeURIComponent(message);
  };

  const sendEmail = () => {
    const mailto = `mailto:info@sharda.com?subject=Product Enquiry&body=${buildEmail()}`;
    window.location.href = mailto;
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">My Wishlist</h1>

      {/* Show enquiry button when at least one is selected */}
      {selected.length > 0 && (
        <button
          onClick={sendEmail}
          className="mb-6 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Enquire Now
        </button>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((item) => {
          const key = item.productId + "-" + item.variantCode;
          const checked = selected.includes(key);

          return (
            <div
              key={key}
              className="border p-4 rounded shadow cursor-pointer"
              onClick={() => navigate(`/products/details/${item.productId}`)}
            >
              {/* Checkbox */}
              <div
                className="flex justify-end"
                onClick={(e) => e.stopPropagation()}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleSelect(item)}
                  className="w-5 h-5 accent-blue-600 cursor-pointer"
                />
              </div>

              {/* Image */}
              <img
                src={item.imageUrl || "/placeholder.webp"}
                alt={item.variantCode}
                className="w-full h-40 object-contain mb-3 rounded"
                onError={(e) => (e.target.src = "/placeholder.webp")}
              />

              {/* Product Name */}
              <h2 className="text-lg font-bold">{item.productName}</h2>

              {/* Variant Code */}
              <p className="font-semibold text-gray-700">
                Code: {item.variantCode}
              </p>

              {/* Remove Button */}
              <button
                className="mt-3 bg-red-500 text-white px-3 py-1 rounded"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(item.variantCode, item.productId);
                }}
              >
                Remove
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
