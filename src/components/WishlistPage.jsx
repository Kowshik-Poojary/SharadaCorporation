// src/pages/WishlistPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function WishlistPage() {
  const navigate = useNavigate();
  const user = typeof window !== "undefined" && JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;
  const [items, setItems] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!userId) return;
    axios.get(`/api/wishlist/${userId}`)
      .then((res) => setItems(res.data))
      .catch(console.error);
  }, [userId]);

  const toggleSelect = (item) => {
    const key = `${item.productId}-${item.variantCode}`;
    setSelectedKeys(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  const handleRemove = async (variantCode, productId) => {
    try {
      await axios.post("/api/wishlist/remove", { userId, productId, variantCode });
      setItems(items.filter(i => !(i.variantCode === variantCode && i.productId === productId)));
      setSelectedKeys(sk => sk.filter(k => k !== `${productId}-${variantCode}`));
    } catch (err) {
      console.error(err);
      alert("Could not remove");
    }
  };

  if (!userId) return <div className="p-6">Please login to view your wishlist.</div>;
  if (!items.length) return <div className="p-6">Your wishlist is empty.</div>;

  const selectedItems = selectedKeys.map(key => {
    return items.find(i => `${i.productId}-${i.variantCode}` === key);
  }).filter(Boolean);

  const sendEnquiry = async () => {
    if (!selectedItems.length) return alert("Select at least one item to enquire.");

    // prepare payload
    const payload = {
      userName: user?.name || user?.fullName || user?.email || "Anonymous",
      userEmail: user?.email || "",
      selectedItems: selectedItems.map(si => ({
        productId: si.productId,
        productName: si.productName,
        variantCode: si.variantCode,
        variantDetails: si.variantDetails,
        imageUrl: si.imageUrl,
      })),
    };

    try {
      setSending(true);
      const res = await axios.post("/api/wishlist/enquire", payload);
      if (res.data?.success) {
        alert("Enquiry sent successfully. We will contact you soon.");
        // optionally clear selection
        setSelectedKeys([]);
      } else {
        alert(res.data?.error || "Failed to send enquiry.");
      }
    } catch (err) {
      console.error("Enquiry error:", err.response || err);
      alert("Failed to send enquiry. Check server logs or SMTP config.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">My Wishlist</h1>

      <div className="mb-4 flex gap-3 items-center">
        <button
          onClick={sendEnquiry}
          disabled={!selectedItems.length || sending}
          className={`px-4 py-2 rounded text-white ${selectedItems.length ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-300 cursor-not-allowed"}`}
        >
          {sending ? "Sending..." : `Enquire Now (${selectedItems.length})`}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map(item => {
          const key = `${item.productId}-${item.variantCode}`;
          const checked = selectedKeys.includes(key);

          return (
            <div key={key} className="border p-4 rounded shadow">
              <div className="flex justify-end">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleSelect(item)}
                  className="w-5 h-5 accent-blue-600 cursor-pointer"
                />
              </div>

              <div
                className="cursor-pointer"
                onClick={() => navigate(`/products/details/${item.productId}`)}
              >
                <img
                  src={item.imageUrl || "/placeholder.webp"}
                  alt={item.variantCode}
                  className="w-full h-40 object-contain mb-3 rounded"
                  onError={(e) => (e.target.src = "/placeholder.webp")}
                />

                <h2 className="text-lg font-bold">{item.productName}</h2>
                <p className="font-semibold text-gray-700">Code: {item.variantCode}</p>
              </div>

              <div className="mt-3 flex gap-2">
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded"
                  onClick={() => handleRemove(item.variantCode, item.productId)}
                >
                  Remove
                </button>
                <button
                  className="bg-gray-200 text-gray-800 px-3 py-1 rounded"
                  onClick={() => navigate(`/products/details/${item.productId}`)}
                >
                  View Product
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
