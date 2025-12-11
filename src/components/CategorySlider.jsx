import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./CategorySlider.css"; // FIXED import (remove .css from name)



/* Your category imports stay the same */

import NewArrival from "../assets/NewArrival.png";
import Disposables from "../assets/Disposable.png";
import SugarcaneBaggasse from "../assets/SugarcaneBaggasse.png";
import RiceHusk from "../assets/RiceHusk.png";
import Cookware from "../assets/Cookware.png";
import KitchenTextile from "../assets/KitchenTextile.png";
import WoodenItems from "../assets/WoodenItems.png";
import Baskets from "../assets/Baskets.png";
import CakeStandDisplayItems from "../assets/CakeStandsAndFruitDispensers.png";
import ChipCones from "../assets/ChipConeHolder.png";
import Tabletop from "../assets/TableTop.png";
import MiniPresentationItems from "../assets/MiniPresentationItems.png";
import PresentationServerware from "../assets/PresentationServerware.png";
import SaltPepperShakers from "../assets/SaltPepperShaker.png";
import BarAccessories from "../assets/BarAccessories.png";
import IceWineBucket from "../assets/IceWineBucket.png";
import WineBucketHolder from "../assets/WineBucketHolder.png";
import CocktailShaker from "../assets/CocktailShaker.png";
import Trays from "../assets/Trays.png";
import KitchenEquipments from "../assets/KitchenEquipments.png";
import KitchenCutlery from "../assets/KitchenCutlery.png";
import RangeOfBowls from "../assets/Bowls.png";
import PreparationUtensils from "../assets/PreparationUtensils.png";
import FoodRings from "../assets/FoodRings.png";
import Whisks from "../assets/Whisks.png";
import Tongs from "../assets/Tongs.png";
import PizzaEquipments from "../assets/PizzaEquipments.png";


const categories = [
  { name: "New Arrivals", img: NewArrival, link: "/products/new-arrivals" },
  { name: "Disposables", img: Disposables, link: "/products/disposables" },
  { name: "Sugarcane Baggasse", img: SugarcaneBaggasse, link: "/products/sugarcane-baggasse" },
  { name: "Rice Husk", img: RiceHusk, link: "/products/rice-husk" },
  { name: "Cookware", img: Cookware, link: "/products/cookware" },
  { name: "Kitchen Textile", img: KitchenTextile, link: "/products/kitchen-textile" },
  { name: "Wooden Items", img: WoodenItems, link: "/products/wooden-items" },
  { name: "Baskets", img: Baskets, link: "/products/baskets" },
  { name: "Cake Stand & Display Items", img: CakeStandDisplayItems, link: "/products/cake-stand-display-items" },
  { name: "Chip Cones", img: ChipCones, link: "/products/chip-cones" },
  { name: "Tabletop", img: Tabletop, link: "/products/tabletop" },
  { name: "Mini Presentation Items", img: MiniPresentationItems, link: "/products/mini-presentation-items" },
  { name: "Presentation Serverware", img: PresentationServerware, link: "/products/presentation-serverware" },
  { name: "Salt Pepper Shakers", img: SaltPepperShakers, link: "/products/salt-pepper-shakers" },
  { name: "Bar Accessories", img: BarAccessories, link: "/products/bar-accessories" },
  { name: "Ice Wine Bucket", img: IceWineBucket, link: "/products/ice-wine-bucket" },
  { name: "Wine Bucket Holder", img: WineBucketHolder, link: "/products/wine-bucket-holder" },
  { name: "Cocktail Shaker", img: CocktailShaker, link: "/products/cocktail-shaker" },
  { name: "Trays", img: Trays, link: "/products/trays" },
  { name: "Kitchen Equipments", img: KitchenEquipments, link: "/products/kitchen-equipments" },
  { name: "Kitchen Cutlery", img: KitchenCutlery, link: "/products/kitchen-cutlery" },
  { name: "Range of Bowls", img: RangeOfBowls, link: "/products/range-of-bowls" },
  { name: "Preparation Utensils", img: PreparationUtensils, link: "/products/preparation-utensils" },
  { name: "Food Rings", img: FoodRings, link: "/products/food-rings" },
  { name: "Whisks", img: Whisks, link: "/products/whisks" },
  { name: "Tongs", img: Tongs, link: "/products/tongs" },
  { name: "Pizza Equipments", img: PizzaEquipments, link: "/products/pizza-equipments" },
];






const CategorySlider = () => {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();
  const touchStart = useRef(0);
  const touchEnd = useRef(0);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % categories.length);
  const prevSlide = () =>
    setCurrent((prev) => (prev === 0 ? categories.length - 1 : prev - 1));

  // Auto slide every 4 sec
  useEffect(() => {
    const timer = setInterval(nextSlide, 4000);
    return () => clearInterval(timer);
  }, []);

  // Swipe handling
  const handleTouchStart = (e) => {
    touchStart.current = e.changedTouches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    touchEnd.current = e.changedTouches[0].clientX;
    const distance = touchStart.current - touchEnd.current;

    if (distance > 50) nextSlide();
    if (distance < -50) prevSlide();
  };

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
            className={`premium-slide ${index === current ? "active" : ""}`}
            key={index}
            onClick={() => navigate(cat.link)}
          >
            <img src={cat.img} alt={cat.name} className="premium-slide-img" />

            {/* Gradient overlay */}
            <div className="premium-overlay"></div>

            {/* Category Name */}
            <div className="premium-title">{cat.name}</div>
          </div>
        ))}
      </div>

      {/* Navigation arrows */}
      <button className="premium-arrow left" onClick={prevSlide}>
        <ChevronLeft size={24} />
      </button>

      <button className="premium-arrow right" onClick={nextSlide}>
        <ChevronRight size={24} />
      </button>

      {/* Pagination bars */}
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
