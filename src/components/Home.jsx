import React, { lazy, Suspense } from "react";

const CategorySlider = lazy(() => import("./CategorySlider"));
const BestSellerSlider = lazy(() => import("./BestSellerSlider"));
const EnquiryMap = lazy(() => import("./enquirymap"));

const Home = () => {
  return (
    <div className="w-full overflow-x-hidden">

      {/* CATEGORY SLIDER */}
      <Suspense fallback={<div className="h-[220px]" />}>
        <div className="px-2 sm:px-3 lg:px-4 pt-2">
          <CategorySlider />
        </div>
      </Suspense>

      {/* REST */}
      <Suspense fallback={<div className="h-[300px]" />}>
        <div className="px-4 sm:px-6 lg:px-10 py-6 sm:py-8 lg:py-10 text-center space-y-8 sm:space-y-10">
          <BestSellerSlider />
          <EnquiryMap />
        </div>
      </Suspense>

    </div>
  );
};

export default Home;
