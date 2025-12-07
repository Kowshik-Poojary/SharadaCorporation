import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

export default function ProductDetailView() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [wishlistedCodes, setWishlistedCodes] = useState(new Set());
  const [loadingWishlistAction, setLoadingWishlistAction] = useState(false);

  // const cloudinaryBase =
  //   "https://res.cloudinary.com/<cloud_name>/image/upload/sharda/variants/";

  // get user from localStorage
  const user = typeof window !== "undefined" && JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;

  useEffect(() => {
    axios
      .get(`/api/products/${id}`)
      .then((res) => {
        setProduct(res.data);
        setSelectedVariant(res.data.variants?.[0] || null);
      })
      .catch(console.error);
  }, [id]);

  // fetch wishlist items for this user (once)
  useEffect(() => {
    if (!userId) return;
    axios
      .get(`/api/wishlist/${userId}`)
      .then((res) => {
        const codes = new Set(res.data.map((i) => i.variantCode));
        setWishlistedCodes(codes);
      })
      .catch(() => {});
  }, [userId]);

  if (!product) return <h2 className="p-6">Loading...</h2>;

  const variantKeys = Object.keys(product.variants[0].data).filter(
    (k) => k.toLowerCase() !== "imageurl"
  );
  const sortedKeys = variantKeys;

  const toggleWishlist = async (variantCode) => {
    if (!userId) {
      alert("Please login to add items to your wishlist.");
      return;
    }
    if (loadingWishlistAction) return;
    setLoadingWishlistAction(true);

    try {
      if (wishlistedCodes.has(variantCode)) {
        await axios.post("/api/wishlist/remove", { userId, productId: product._id, variantCode });
        const next = new Set(wishlistedCodes);
        next.delete(variantCode);
        setWishlistedCodes(next);
      } else {
        await axios.post("/api/wishlist/add", { userId, productId: product._id, variantCode });
        const next = new Set(wishlistedCodes);
        next.add(variantCode);
        setWishlistedCodes(next);
      }
      window.dispatchEvent(new Event("wishlistUpdated"));
    } catch (err) {
      console.error(err);
      alert("Action failed. Try again.");
    } finally {
      setLoadingWishlistAction(false);
    }
  };

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col md:flex-row gap-10">
        <div className="md:w-1/2 w-full space-y-6">
          <img
            src={product.imageUrl || "/placeholder.webp"}
            className="w-full rounded shadow object-cover"
            alt={product.name}
          />

          {selectedVariant && (
            <div className="border rounded-lg p-3 shadow text-center">
              <img
                src={selectedVariant.data.imageUrl || "/placeholder.webp"}
                alt={selectedVariant.data["Code #"]}
                className="w-full max-h-80 object-contain mx-auto"
                onError={(e) => (e.target.src = "/placeholder.webp")}
              />
              <p className="mt-2 text-sm text-gray-600">
                Image for: <b>{selectedVariant.data["Code #"]}</b>
              </p>
            </div>
          )}
        </div>

        <div className="md:w-1/2 w-full">
          <h1 className="text-2xl md:text-3xl font-bold">{product.name}</h1>
          <p className="text-gray-500 mb-4">{product.category}</p>

          <div className="mb-3">
            <Link to="/wishlist" className="text-yellow-600 underline">Go to Wishlist</Link>
          </div>

          <h2 className="text-xl font-semibold mb-3">Available Variants</h2>

          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full text-sm md:text-base border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-3 border text-left font-semibold whitespace-nowrap">Image</th>
                  {sortedKeys.map((key) => (
                    <th key={key} className="px-4 py-3 border text-left font-semibold whitespace-nowrap">{key}</th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {product.variants.map((variant, idx) => {
                  const code = variant.data["Code #"];
                  const isWishlisted = wishlistedCodes.has(variant.data["Code #"]);
                  return (
                    <tr
                      key={idx}
                      onClick={() => setSelectedVariant(variant)}
                      className={`border-t cursor-pointer transition ${
                        selectedVariant === variant ? "bg-yellow-100" : idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                      } hover:bg-yellow-50`}
                    >
                      <td className="px-3 py-2 border flex items-center gap-3">
                        <img
                          src={variant.data.imageUrl || "/placeholder.webp"}
                          alt={code}
                          className="h-12 w-12 object-cover rounded border"
                          onError={(e) => (e.target.src = "/placeholder.webp")}
                        />

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWishlist(variant.data["Code #"]);
                          }}
                          className="text-xl"
                          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                        >
                          {isWishlisted ? "💖" : "🤍"}
                        </button>
                      </td>

                      {sortedKeys.map((key) => (
                        <td key={key} className="px-4 py-3 border whitespace-nowrap">{variant.data[key] || "-"}</td>
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
