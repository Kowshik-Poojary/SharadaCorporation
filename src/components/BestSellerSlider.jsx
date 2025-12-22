import React, { useEffect, useState, useRef } from "react";
import axios from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";

export default function BestSellerSlider() {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();
  const trackRef = useRef(null);
  const positionRef = useRef(0);

  /* ---------------- FETCH DATA ---------------- */
  useEffect(() => {
    axios
      .get("/api/admin/best-seller-variants")
      .then((res) => setItems(res.data))
      .catch(() => setItems([]));
  }, []);

  /* ---------------- SLOW INFINITE AUTO SLIDE ---------------- */
  useEffect(() => {
    const track = trackRef.current;
    if (!track || items.length === 0) return;

    let speed = 0.6; // 🔥 SLOW & VISIBLE (adjust 0.4 – 1)
    let paused = false;

    const animate = () => {
      if (!paused) {
        positionRef.current -= speed;

        // reset seamlessly at half width
        if (Math.abs(positionRef.current) >= track.scrollWidth / 2) {
          positionRef.current = 0;
        }

        track.style.transform = `translateX(${positionRef.current}px)`;
      }

      requestAnimationFrame(animate);
    };

    animate();

    /* Pause on hover / touch */
    const pause = () => (paused = true);
    const resume = () => (paused = false);

    track.addEventListener("mouseenter", pause);
    track.addEventListener("mouseleave", resume);
    track.addEventListener("touchstart", pause);
    track.addEventListener("touchend", resume);

    return () => {
      track.removeEventListener("mouseenter", pause);
      track.removeEventListener("mouseleave", resume);
      track.removeEventListener("touchstart", pause);
      track.removeEventListener("touchend", resume);
    };
  }, [items]);

  return (
    <div className="w-full px-4 sm:px-6 mt-12 flex flex-col items-center overflow-hidden">

      {/* TITLE */}
      <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-gray-900">
        ⭐ Best Sellers
      </h2>

      <div className="w-24 sm:w-32 h-1 bg-yellow-400 rounded-full mb-6"></div>

      {/* VIEWPORT */}
      <div className="w-full overflow-hidden">
        {/* TRACK */}
        <div
          ref={trackRef}
          className="flex gap-4 sm:gap-6 will-change-transform"
        >
          {[...items, ...items].map((item, index) => (
            <div
              key={`${item.variant._id}-${index}`}
              onClick={() => navigate(`/products/details/${item.productId}`)}
              className="
                min-w-[180px] sm:min-w-[220px] lg:min-w-[240px]
                bg-white
                border border-gray-200
                rounded-2xl p-3
                cursor-pointer
                transition-transform duration-300
                hover:scale-[1.03]
                hover:shadow-lg
              "
            >
              {/* IMAGE – PURE WHITE */}
              <img
                src={item.variant.imageUrl}
                alt={item.productName}
                className="h-32 sm:h-36 lg:h-40 w-full object-contain bg-white rounded-xl"
              />

              <h3 className="text-sm sm:text-base lg:text-lg font-semibold mt-3 text-gray-900 truncate">
                {item.productName}
              </h3>

              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                {item.variant.code}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
