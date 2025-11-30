import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function ProductDetailView() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);

  // your cloud name & folder
  const cloudinaryBase =
    "https://res.cloudinary.com/<cloud_name>/image/upload/sharda/variants/";

  useEffect(() => {
    axios
      .get(`/api/products/${id}`)
      .then((res) => {
        setProduct(res.data);
        setSelectedVariant(res.data.variants[0]); // default first variant
      })
      .catch(console.error);
  }, [id]);

  if (!product) return <h2 className="p-6">Loading...</h2>;

 const variantKeys = Object.keys(product.variants[0].data).filter(
  (k) => k.toLowerCase() !== "imageurl"
);

const sortedKeys = variantKeys;


  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col md:flex-row gap-10">

        {/* LEFT SECTION */}
        <div className="md:w-1/2 w-full space-y-6">

          {/* Main product image */}
          <img
            src={product.imageUrl || "/placeholder.webp"}
            className="w-full rounded shadow object-cover"
            alt={product.name}
          />

          {/* Variant Full Image */}
          {selectedVariant && (
            <div className="border rounded-lg p-3 shadow text-center">
              <img
                src={`${cloudinaryBase}${selectedVariant.data.code}.jpg`}
                alt={selectedVariant.data.code}
                className="w-full max-h-80 object-contain mx-auto"
                onError={(e) => (e.target.src = "/placeholder.webp")}
              />
              <p className="mt-2 text-sm text-gray-600">
                Image for: <b>{selectedVariant.data.code}</b>
              </p>
            </div>
          )}
        </div>

        {/* RIGHT SECTION */}
        <div className="md:w-1/2 w-full">
          <h1 className="text-2xl md:text-3xl font-bold">{product.name}</h1>
          <p className="text-gray-500 mb-4">{product.category}</p>

          <h2 className="text-xl font-semibold mb-3">Available Variants</h2>

          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full text-sm md:text-base border-collapse">
              <thead>
                <tr className="bg-gray-200">

                  {/* Image Column */}
                  <th className="px-4 py-3 border text-left font-semibold whitespace-nowrap">
                    Image
                  </th>

                  {/* Variant Data Columns */}
                  {sortedKeys.map((key) => (
                    <th
                      key={key}
                      className="px-4 py-3 border text-left font-semibold whitespace-nowrap"
                    >
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {product.variants.map((variant, idx) => {
                  const code = variant.data.code;

                  return (
                    <tr
                      key={idx}
                      onClick={() => setSelectedVariant(variant)}
                      className={`border-t cursor-pointer transition ${
                        selectedVariant === variant
                          ? "bg-yellow-100"
                          : idx % 2 === 0
                          ? "bg-gray-50"
                          : "bg-white"
                      } hover:bg-yellow-50`}
                    >
                      {/* Thumbnail Image */}
                      <td className="px-3 py-2 border">
                        <img
                          src={`${cloudinaryBase}${code}.jpg`}
                          alt={code}
                          className="h-12 w-12 object-cover rounded border"
                          onError={(e) => (e.target.src = "/placeholder.webp")}
                        />
                      </td>

                      {/* Data Columns */}
                      {sortedKeys.map((key) => (
                        <td key={key} className="px-4 py-3 border whitespace-nowrap">
                          {variant.data[key] || "-"}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {product.description && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold">Description</h3>
              <p className="text-sm md:text-base">{product.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
