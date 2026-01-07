import React from "react";

const BestSellerSliderSkeleton = () => {
  return (
    <div className="w-full px-4 sm:px-6 mt-12">
      <div className="h-8 w-48 mx-auto bg-gray-200 rounded mb-3 animate-pulse"></div>
      <div className="h-1 w-24 mx-auto bg-gray-300 rounded mb-6 animate-pulse"></div>

      <div className="flex gap-4 overflow-hidden animate-pulse">
        {[1, 2, 3, 4,5 ,6 ,7 ,8 ,9 , 10].map((i) => (
          <div
            key={i}
            className="min-w-[180px] sm:min-w-[220px] lg:min-w-[240px]
                       h-[260px] bg-gray-200 rounded-2xl"
          />
        ))}
      </div>

      <p className="text-sm text-gray-400 text-center mt-4">
        Loading best sellers…
      </p>
    </div>
  );
};

export default BestSellerSliderSkeleton;
