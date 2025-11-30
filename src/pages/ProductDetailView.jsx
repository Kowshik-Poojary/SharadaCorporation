import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function ProductDetailView() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    axios.get(`/api/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(console.error);
  }, [id]);

  if (!product) return <h2 className="p-6">Loading...</h2>;

  const variantKeys = Object.keys(product.variants[0].data);

  // 🔥 Remove unnecessary columns (blank columns)
  const filteredKeys = variantKeys.filter(key =>
    product.variants.some(v => v.data[key] && v.data[key].toString().trim() !== "")
  );

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col md:flex-row gap-10">

        {/* PRODUCT IMAGE */}
        <div className="md:w-1/2 w-full">
          <img
            src={product.imageUrl || "/placeholder.webp"}
            className="w-full rounded shadow object-cover"
            alt={product.name}
          />
        </div>

        {/* DETAILS */}
        <div className="md:w-1/2 w-full">
          <h1 className="text-2xl md:text-3xl font-bold">{product.name}</h1>
          <p className="text-gray-500 mb-4">{product.category}</p>

          {/* VARIANT TABLE */}
          <h2 className="text-xl font-semibold mb-3">Available Variants</h2>

          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full text-sm md:text-base border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  {filteredKeys.map(key => (
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
                {product.variants.map((variant, idx) => (
                  <tr
                    key={idx}
                    className={`border-t hover:bg-gray-50 ${
                      idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                    }`}
                  >
                    {filteredKeys.map(key => (
                      <td
                        key={key}
                        className="px-4 py-3 border whitespace-nowrap"
                      >
                        {variant.data[key] || "-"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* DESCRIPTION */}
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
