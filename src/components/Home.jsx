// src/components/Home.jsx
import React from "react";
import CategorySlider from "./CategorySlider";
import BestSellerSlider from "./BestSellerSlider";   // ⭐ NEW COMPONENT
import EnquiryMap from "./enquirymap";

const Home = () => {
  return (
    <div className="w-full overflow-x-hidden">

      {/* CATEGORY SLIDER – VERY SMALL PADDING */}
      <div className="px-2 sm:px-3 lg:px-4 pt-2">
        <CategorySlider />
      </div>

      {/* REST OF PAGE */}
      <div className="px-4 sm:px-6 lg:px-10 py-6 sm:py-8 lg:py-10 text-center space-y-8 sm:space-y-10">
        <BestSellerSlider />

        <div className="mt-4 sm:mt-6">
          <EnquiryMap />
        </div>
      </div>

    </div>
  );
};



export default Home;
