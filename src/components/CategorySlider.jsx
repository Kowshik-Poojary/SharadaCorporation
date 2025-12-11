import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./CategorySlider.css";

const CategorySlider = () => {
  const [categories, setCategories] = useState([]);
  const [current, setCurrent] = useState(0);

  const navigate = useNavigate();
  const touchStart = useRef(0);
  const touchEnd = useRef(0);

  /* ----------------------------------------
        LOAD CATEGORIES
  ----------------------------------------- */
  useEffect(() => {
    axios
      .get("/api/admin/categories/all")
      .then((res) => {
        // backend returns ["Cookware", "Baskets", ...]
        // convert to slider format
        const processed = res.data.map((c) => ({
          _id: c._id,
          name: c.name,
          imageUrl: c.imageUrl || "/placeholder.webp",
          link: `/products/catalogue/${encodeURIComponent(c.name)}`
        }));

        setCategories(processed);
      })
      .catch(() => setCategories([]));
  }, []);

  /* ----------------------------------------
        AUTO SLIDE
  ----------------------------------------- */
  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % categories.length);
  };

  const prevSlide = () => {
    setCurrent((prev) =>
      prev === 0 ? categories.length - 1 : prev - 1
    );
  };

  useEffect(() => {
    if (categories.length <= 1) return; // prevent sliding if only 1 category
    const timer = setInterval(nextSlide, 4000);
    return () => clearInterval(timer);
  }, [categories]);


  /* ----------------------------------------
        SWIPE CONTROLS
  ----------------------------------------- */
  const handleTouchStart = (e) => {
    touchStart.current = e.changedTouches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    touchEnd.current = e.changedTouches[0].clientX;
    const distance = touchStart.current - touchEnd.current;

    if (distance > 50) nextSlide();
    if (distance < -50) prevSlide();
  };

  /* ----------------------------------------
        RENDER
  ----------------------------------------- */
  return (
    <div className="premium-slider-container">
      {/* Slides */}
      <div
        className="premium-slides"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {categories.map((cat, index) => (
          <div
            key={cat._id || index}
            className={`premium-slide ${index === current ? "active" : ""}`}
            onClick={() => navigate(cat.link)}
          >
            <img
              src={cat.imageUrl}
              alt={cat.name}
              className="premium-slide-img"
              onError={(e) => (e.target.src = "/placeholder.webp")}
            />

            <div className="premium-overlay"></div>

            <div className="premium-title">{cat.name}</div>
          </div>
        ))}
      </div>

      {/* Arrows */}
      {categories.length > 1 && (
        <>
          <button className="premium-arrow left" onClick={prevSlide}>
            <ChevronLeft size={24} />
          </button>

          <button className="premium-arrow right" onClick={nextSlide}>
            <ChevronRight size={24} />
          </button>
        </>
      )}

      {/* Pagination Dots */}
      <div className="premium-dots">
        {categories.map((_, idx) => (
          <div
            key={idx}
            className={`premium-dot ${current === idx ? "active" : ""}`}
            onClick={() => setCurrent(idx)}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default CategorySlider;
