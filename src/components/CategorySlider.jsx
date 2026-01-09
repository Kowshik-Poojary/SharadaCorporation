import React, { useState, useEffect, useRef } from "react";
import axios from "../utils/axiosInstance";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CategorySliderSkeleton from "./skeletons/CategorySliderSkeleton";

const CategorySlider = () => {
  const [categories, setCategories] = useState([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const touchStart = useRef(0);
  const touchEnd = useRef(0);
  const autoSlideRef = useRef(null);

  /* -------- START AUTO SLIDE -------- */
  const startAutoSlide = () => {
    clearInterval(autoSlideRef.current);
    autoSlideRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % categories.length);
    }, 4500);
  };

  const stopAutoSlide = () => {
    clearInterval(autoSlideRef.current);
  };

  /* -------- LOAD CATEGORIES -------- */
  useEffect(() => {
    setLoading(true);
    
    // Check sessionStorage cache first
    const cachedCategories = sessionStorage.getItem("categorySliderData");
    if (cachedCategories) {
      try {
        const parsed = JSON.parse(cachedCategories);
        setCategories(parsed);
        setCurrent(0);
        setLoading(false);
        return;
      } catch (e) {
        console.error("Cache parse error:", e);
      }
    }

    axios
      .get("/api/admin/categories/all")
      .then((res) => {
        const processed = res.data.map((c) => ({
          _id: c._id,
          name: c.name,
          imageUrl: c.imageUrl || "/placeholder.webp",
          link: `/products/catalogue/${encodeURIComponent(c.name)}`,
        }));

        // ✅ FORCE "New Arrival" FIRST
        const newArrival = processed.find(
          (c) => c.name.toLowerCase() === "new arrival"
        );

        const others = processed.filter(
          (c) => c.name.toLowerCase() !== "new arrival"
        );

        const ordered = newArrival
          ? [newArrival, ...others]
          : processed;

        setCategories(ordered);
        // Cache the data
        sessionStorage.setItem("categorySliderData", JSON.stringify(ordered));
        setCurrent(0);
        setLoading(false);
      })
      .catch(() => {
        setCategories([]);
        setLoading(false);
      });
  }, []);

  /* -------- AUTO SLIDE INIT -------- */
  useEffect(() => {
    if (categories.length <= 1) return;

    startAutoSlide();
    return () => stopAutoSlide();
  }, [categories]);

  /* -------- SHOW SKELETON WHILE LOADING -------- */
  if (loading) {
    return <CategorySliderSkeleton />;
  }

  /* -------- SWIPE -------- */
  const handleTouchStart = (e) => {
    stopAutoSlide(); // pause only during swipe
    touchStart.current = e.changedTouches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    touchEnd.current = e.changedTouches[0].clientX;
    const distance = touchStart.current - touchEnd.current;

    if (distance > 50)
      setCurrent((prev) => (prev + 1) % categories.length);

    if (distance < -50)
      setCurrent((prev) =>
        prev === 0 ? categories.length - 1 : prev - 1
      );

    startAutoSlide(); // ✅ restart after swipe
  };

  return (
    <div
      className="w-full overflow-hidden relative rounded-xl"
      onMouseEnter={stopAutoSlide}   // desktop hover pause
      onMouseLeave={startAutoSlide} // resume
    >
      {/* SLIDES */}
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{ transform: `translateX(-${current * 100}%)` }}
        className="flex transition-transform duration-700 ease-in-out"
      >
        {categories.map((cat, index) => (
          <div
            key={cat._id || index}
            onClick={() => navigate(cat.link)}
            className={`
              min-w-full relative cursor-pointer
              transition-all duration-500
              ${
                index === current
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-[0.98]"
              }
            `}
          >
            {/* IMAGE */}
            <img
              src={cat.imageUrl}
              alt={cat.name}
              onError={(e) => (e.target.src = "/placeholder.webp")}
              loading="lazy"
              className="
                w-full rounded-xl block
                object-contain bg-white aspect-[16/9]
                sm:aspect-[4/3]
                md:object-cover md:bg-transparent md:aspect-auto
              "
            />

            {/* OVERLAY */}
            <div
              className="
                absolute bottom-0 w-full rounded-xl
                h-[30%] sm:h-[40%] md:h-[45%]
                bg-gradient-to-t from-black/60 to-transparent
              "
            />

            {/* TITLE */}
            <div
              className="
                absolute left-4 bottom-2 sm:bottom-3
                text-white font-bold drop-shadow
                text-base md:text-[1.4rem]
              "
            >
              {cat.name}
            </div>
          </div>
        ))}
      </div>

      {/* ARROWS */}
      {categories.length > 1 && (
        <>
          <button
            onClick={() =>
              setCurrent((prev) =>
                prev === 0 ? categories.length - 1 : prev - 1
              )
            }
            className="
              hidden md:flex absolute left-3 top-1/2 -translate-y-1/2
              bg-black/45 hover:bg-black/60 text-white
              p-2 rounded-full z-20 transition
            "
          >
            <ChevronLeft size={24} />
          </button>

          <button
            onClick={() =>
              setCurrent((prev) => (prev + 1) % categories.length)
            }
            className="
              hidden md:flex absolute right-3 top-1/2 -translate-y-1/2
              bg-black/45 hover:bg-black/60 text-white
              p-2 rounded-full z-20 transition
            "
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      {/* DOTS */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
        {categories.map((_, idx) => (
          <div
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`h-1 rounded-full cursor-pointer transition-all
              ${current === idx ? "w-7 bg-white" : "w-4 bg-white/50"}
            `}
          />
        ))}
      </div>
    </div>
  );
};

export default CategorySlider;
