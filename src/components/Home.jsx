// src/components/Home.jsx
import React from "react";
import CategorySlider from "./CategorySlider";
import BestSellerSlider from "./BestSellerSlider";   // ⭐ NEW COMPONENT
import EnquiryMap from "./enquirymap";

const Home = () => {
  return (
    <div className="p-10 text-center space-y-10">

      {/* CATEGORY SLIDER */}
      <CategorySlider />

      {/* BEST SELLING VARIANTS SLIDER */}
      <BestSellerSlider />

      {/* ENQUIRY MAP SECTION */}
      <div className="mt-6">
        <EnquiryMap />
      </div>

    </div>
  );
};

export default Home;
