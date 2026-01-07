import React from "react";

const CategorySliderSkeleton = () => {
  return (
    <div className="w-full rounded-xl overflow-hidden animate-pulse">
      <div className="w-full aspect-[16/9] sm:aspect-[3/1] bg-gray-200 rounded-xl"></div>

      <div className="flex justify-center gap-2 mt-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-1 w-6 bg-gray-300 rounded-full"></div>
        ))}
      </div>

      <p className="text-sm text-gray-400 text-center mt-2">
        Loading categories…
      </p>
    </div>
  );
};

export default CategorySliderSkeleton;
