// src/components/Home.jsx
import React from "react";
import CategorySlider from "./CategorySlider";
import EnquiryMap from "./enquirymap";

const Home = () => {
  return (
    <div className="p-10 text-center">
      <CategorySlider/>
      <div className="mt-6">
        <EnquiryMap />
      </div>
    </div>
  );
};

export default Home;
