// src/components/Products.jsx
import React from "react";
import { useParams } from "react-router-dom";

const Products = ({ category }) => {
  const { catName } = useParams();
  const displayCategory = category || catName;

  return (
    <div className="p-10 text-center">
      <h1 className="text-3xl font-bold">{displayCategory} Products</h1>
      <p className="mt-4 text-gray-700">
        Showing all products under {displayCategory}.
      </p>
    </div>
  );
};

export default Products;
