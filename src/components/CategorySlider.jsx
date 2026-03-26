import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "../utils/axiosInstance";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CategorySliderSkeleton from "./skeletons/CategorySliderSkeleton";
import { getImageUrl } from "../constants/categoryImages";

const CategorySlider = () => {
  const [categories, setCategories] = useState([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const touchStart = useRef(0);
  const autoSlideRef = useRef(null);

  // ========== AUTO SLIDE CONTROLS ==========
  const stopAutoSlide = useCallback(() => {
    if (autoSlideRef.current) {
      clearInterval(autoSlideRef.current);
      autoSlideRef.current = null;
    }
  }, []);

  const startAutoSlide = useCallback(() => {
    stopAutoSlide();
    if (categories.length <= 1) return;

    autoSlideRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1 >= categories.length ? 0 : prev + 1));
    }, 4500);
  }, [categories.length, stopAutoSlide]);

  // ========== LOAD CATEGORIES WITH CACHING ==========
  useEffect(() => {
    let mounted = true;

    // Step 1: Check session cache (valid for 24 hours)
    const cached = sessionStorage.getItem("categorySliderData");
    const cacheTime = sessionStorage.getItem("categorySliderTime");
    const now = Date.now();

    // Cache valid for 24 hours
    if (cached && cacheTime && now - parseInt(cacheTime) < 24 * 60 * 60 * 1000) {
      try {
        const parsed = JSON.parse(cached);
        if (mounted) {
          setCategories(parsed);
          setCurrent(0);
          setLoading(false);
        }
        return;
      } catch {
        // Fallback to API
      }
    }

    // Step 2: Fetch from API only if cache is invalid or missing
    axios
      .get("/api/admin/categories/all", {
        headers: {
          "Cache-Control": "public, max-age=86400",
        },
      })
      .then((res) => {
        if (!mounted) return;

        // Use local image mapping
        const processed = res.data.map((c) => ({
          _id: c._id,
          name: c.name,
          imageUrl: getImageUrl(c.name),
          link: `/products/catalogue/${encodeURIComponent(c.name)}`,
        }));

        // Reorder: New Arrival first
        const newArrival = processed.find(
          (c) => c.name.toLowerCase() === "new arrival"
        );
        const others = processed.filter(
          (c) => c.name.toLowerCase() !== "new arrival"
        );
        const ordered = newArrival ? [newArrival, ...others] : processed;

        // Cache both data and timestamp
        sessionStorage.setItem("categorySliderData", JSON.stringify(ordered));
        sessionStorage.setItem("categorySliderTime", now.toString());

        setCategories(ordered);
        setCurrent(0);
      })
      .catch((err) => {
        console.error("Failed to load categories:", err);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  // ========== AUTO SLIDE INIT ==========
  useEffect(() => {
    startAutoSlide();
    return stopAutoSlide;
  }, [startAutoSlide, stopAutoSlide]);

  if (loading) return <CategorySliderSkeleton />;

  // ========== TOUCH HANDLERS ==========
  const handleTouchStart = (e) => {
    stopAutoSlide();
    touchStart.current = e.changedTouches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    const touchEnd = e.changedTouches[0].clientX;
    const distance = touchStart.current - touchEnd;

    if (distance > 50) {
      setCurrent((prev) => (prev + 1 >= categories.length ? 0 : prev + 1));
    }
    if (distance < -50) {
      setCurrent((prev) => (prev === 0 ? categories.length - 1 : prev - 1));
    }

    startAutoSlide();
  };

  return (
    <div
      className="w-full overflow-hidden relative rounded-xl"
      onMouseEnter={stopAutoSlide}
      onMouseLeave={startAutoSlide}
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
            {/* IMAGE WITH LOADING OPTIMIZATION */}
            <img
              src={cat.imageUrl}
              alt={cat.name}
              loading="lazy"
              decoding="async"
              fetchPriority={index === current ? "high" : "low"}
              onError={(e) => {
                // Only set fallback if not already a fallback (prevent infinite loop)
                if (!e.target.src.includes("placeholder")) {
                  e.target.src = "/placeholder.png";
                  console.warn(`Image failed to load: ${cat.imageUrl}, using placeholder`);
                }
              }}
              className="
                w-full rounded-xl block
                object-contain bg-white aspect-[16/9]
                sm:aspect-[4/3]
                md:object-cover md:bg-transparent md:aspect-auto
              "
            />

            {/* GRADIENT OVERLAY */}
            <div
              className="
                absolute bottom-0 w-full rounded-xl
                h-[30%] sm:h-[40%] md:h-[45%]
                bg-gradient-to-t from-black/60 to-transparent
              "
            />

            {/* CATEGORY NAME */}
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

      {/* NAVIGATION ARROWS */}
      {categories.length > 1 && (
        <>
          <button
            onClick={() =>
              setCurrent((prev) =>
                prev === 0 ? categories.length - 1 : prev - 1
              )
            }
            aria-label="Previous category"
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
              setCurrent((prev) =>
                prev + 1 >= categories.length ? 0 : prev + 1
              )
            }
            aria-label="Next category"
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

      {/* PAGINATION DOTS */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
        {categories.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            aria-label={`Go to category ${idx + 1}`}
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