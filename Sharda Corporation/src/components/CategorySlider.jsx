import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react"; // icon package (install with: npm install lucide-react)
import NewArrival from "../assets/NewArrival.png"

const categories = [
  {
    name: "New Arrival",
    img: NewArrival,
    link: "/products/NewArrival",
  },
  {
    name: "Clothing",
    img: "https://via.placeholder.com/1600x600?text=Clothing",
    link: "/products/clothing",
  },
  {
    name: "Furniture",
    img: "https://via.placeholder.com/1600x600?text=Furniture",
    link: "/products/furniture",
  },
  {
    name: "Accessories",
    img: "https://via.placeholder.com/1600x600?text=Accessories",
    link: "/products/accessories",
  },
];

const CategorySlider = () => {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  // Auto slide every 5s
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [current]);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % categories.length);
  };

  const prevSlide = () => {
    setCurrent((prev) =>
      prev === 0 ? categories.length - 1 : prev - 1
    );
  };

  return (
    <div className="relative w-full overflow-hidden">
      {/* Slides */}
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {categories.map((cat, index) => (
          <div
            key={index}
            className="w-full h-auto object-cover flex-shrink-0 cursor-pointer relative"
            onClick={() => navigate(cat.link)}
          >
            <img
              src={cat.img}
              alt={cat.name}
              className="w-full h-auto object-cover"
            />
          </div>
        ))}
      </div>

      {/* Left button */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-5 transform -translate-y-1/2 bg-black bg-opacity-40 text-white p-3 rounded-full hover:bg-opacity-70"
      >
        <ChevronLeft size={28} />
      </button>

      {/* Right button */}
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-5 transform -translate-y-1/2 bg-black bg-opacity-40 text-white p-3 rounded-full hover:bg-opacity-70"
      >
        <ChevronRight size={28} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {categories.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`w-4 h-4 rounded-full ${
              current === idx ? "bg-white" : "bg-gray-500"
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default CategorySlider;
