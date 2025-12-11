import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function BestSellerSlider() {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();
  const sliderRef = useRef(null);

  useEffect(() => {
    axios.get("/api/admin/best-seller-variants").then((res) => setItems(res.data));
  }, []);

  // Auto-scroll infinite loop effect
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    let scrollInterval = setInterval(() => {
      if (slider.scrollLeft + slider.clientWidth >= slider.scrollWidth) {
        slider.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        slider.scrollBy({ left: 250, behavior: "smooth" });
      }
    }, 2500);

    return () => clearInterval(scrollInterval);
  }, [items]);

  return (
    <div className="w-full px-4 mt-12 flex flex-col items-center">
      
      {/* CENTERED SECTION TITLE */}
      <h2 className="text-3xl font-bold mb-2 tracking-wide text-gray-900">
        ⭐ Best Sellers
      </h2>

      {/* Premium Separator */}
      <div className="w-32 h-1 bg-yellow-400 rounded-full mb-6"></div>

      {/* Scroller */}
      <div
        ref={sliderRef}
        className="flex overflow-x-auto gap-6 py-4 px-1 scrollbar-hide snap-x scroll-smooth justify-center"
      >
        {items.map((item) => (
          <div
            key={item.variant._id}
            onClick={() => navigate(`/products/details/${item.productId}`)}
            className="
              min-w-[230px] 
              bg-white/80 backdrop-blur-md 
              shadow-lg border border-gray-200 
              rounded-xl p-3 snap-start cursor-pointer 
              transition-transform duration-300 hover:scale-105 hover:shadow-xl
            "
          >
            {/* Product Image */}
            <img
              src={item.variant.imageUrl}
              alt={item.productName}
              className="h-40 w-full object-cover rounded-lg"
            />

            <h3 className="text-lg font-bold mt-2 text-gray-900">
              {item.productName}
            </h3>

            <p className="text-sm text-gray-500">{item.variant.code}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
