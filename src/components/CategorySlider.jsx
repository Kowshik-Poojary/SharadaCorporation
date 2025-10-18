import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react"; // icon package (install with: npm install lucide-react)
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
  {
    name: "New Arrivals",
    img: NewArrival,
    link: "/products/new-arrivals",
  },
  {
    name: "Disposables",
    img: Disposables,
    link: "/products/disposables",
  },
  {
    name: "Sugarcane Baggasse",
    img: SugarcaneBaggasse,
    link: "/products/sugarcane-baggasse",
  },
  {
    name: "Rice Husk",
    img: RiceHusk,
    link: "/products/rice-husk",
  },
  {
    name: "Cookware",
    img: Cookware,
    link: "/products/cookware",
  },
  {
    name: "Kitchen Textile",
    img: KitchenTextile,
    link: "/products/kitchen-textile",
  },
  {
    name: "Wooden Items",
    img: WoodenItems,
    link: "/products/wooden-items",
  },
  {
    name: "Baskets",
    img: Baskets,
    link: "/products/baskets",
  },
  {
    name: "Cake Stand & Display Items",
    img: CakeStandDisplayItems,
    link: "/products/cake-stand-display-items",
  },
  {
    name: "Chip Cones",
    img: ChipCones,
    link: "/products/chip-cones",
  },
  {
    name: "Tabletop",
    img: Tabletop,
    link: "/products/tabletop",
  },
  {
    name: "Mini Presentation Items",
    img: MiniPresentationItems,
    link: "/products/mini-presentation-items",
  },
  {
    name: "Presentation Serverware",
    img: PresentationServerware,
    link: "/products/presentation-serverware",
  },
  {
    name: "Salt Pepper Shakers",
    img: SaltPepperShakers,
    link: "/products/salt-pepper-shakers",
  },
  {
    name: "Bar Accessories",
    img: BarAccessories,
    link: "/products/bar-accessories",
  },
  {
    name: "Ice Wine Bucket",
    img: IceWineBucket,
    link: "/products/ice-wine-bucket",
  },
  {
    name: "Wine Bucket Holder",
    img: WineBucketHolder,
    link: "/products/wine-bucket-holder",
  },
  {
    name: "Cocktail Shaker",
    img: CocktailShaker,
    link: "/products/cocktail-shaker",
  },
  {
    name: "Trays",
    img: Trays,
    link: "/products/trays",
  },
  {
    name: "Kitchen Equipments",
    img: KitchenEquipments,
    link: "/products/kitchen-equipments",
  },
  {
    name: "Kitchen Cutlery",
    img: KitchenCutlery,
    link: "/products/kitchen-cutlery",
  },
  {
    name: "Range of Bowls",
    img: RangeOfBowls,
    link: "/products/range-of-bowls",
  },
  {
    name: "Preparation Utensils",
    img: PreparationUtensils,
    link: "/products/preparation-utensils",
  },
  {
    name: "Food Rings",
    img: FoodRings,
    link: "/products/food-rings",
  },
  {
    name: "Whisks",
    img: Whisks,
    link: "/products/whisks",
  },
  {
    name: "Tongs",
    img: Tongs,
    link: "/products/tongs",
  },
  {
    name: "Pizza Equipments",
    img: PizzaEquipments,
    link: "/products/pizza-equipments",
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
