// src/components/Home.jsx
import React from "react";
import CategorySlider from "./CategorySlider";
import EnquiryMap from "./enquirymap";

const Home = () => {
  return (
    <div className="p-10 text-center">
      <h1 className="text-3xl font-bold">Welcome to Sharda Corporation</h1>
      <p className="mt-4 text-gray-700">This is the Home page.</p>
      <CategorySlider/>
      <div className="mt-6">
        <EnquiryMap />
      </div>
    </div>
  );
};

export default Home;
