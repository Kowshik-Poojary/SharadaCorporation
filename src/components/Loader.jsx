// src/components/Loader.jsx
import React from "react";

const Loader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-[9999]">
      <div className="w-12 h-12 border-4 border-gray-200 border-t-yellow-400 rounded-full animate-spin"></div>
    </div>
  );
};

export default Loader;
