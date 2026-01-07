import React, { useEffect, useState, useRef } from "react";
import axios from "../utils/axiosInstance";
import { useParams, Link, useNavigate } from "react-router-dom";

export default function ProductDetailView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [wishlistedCodes, setWishlistedCodes] = useState(new Set());
  const [loadingWishlistAction, setLoadingWishlistAction] = useState(false);

  const imgContainerRef = useRef(null);
  const imgRef = useRef(null);

  const user =
    typeof window !== "undefined" && JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;

  /* ---------------- FETCH PRODUCT ---------------- */
  useEffect(() => {
    axios
      .get(`/api/products/${id}`)
      .then((res) => {
        setProduct(res.data);
        setSelectedVariant(res.data.variants?.[0] || null);
      })
      .catch(console.error);
  }, [id]);

  /* ---------------- FETCH WISHLIST ---------------- */
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

  /* ---------------- IMAGE ZOOM ---------------- */
  useEffect(() => {
    const container = imgContainerRef.current;
    const img = imgRef.current;
    if (!container || !img) return;

    let scale = 1;

    const handleWheel = (e) => {
      e.preventDefault();
      scale += e.deltaY * -0.002;
      scale = Math.min(Math.max(scale, 1), 4);
      img.style.transform = `scale(${scale})`;
    };

    container.addEventListener("wheel", handleWheel);
    return () => container.removeEventListener("wheel", handleWheel);
  }, [selectedVariant]);

  if (!product) return <h2 className="p-6">Loading...</h2>;

  /* ---------------- VARIANT KEYS ---------------- */
  const variantKeys = Array.from(
    new Set(
      product.variants
        ?.flatMap((v) => Object.keys(v?.data || {}))
        .filter((k) => k.toLowerCase() !== "imageurl")
    )
  );

  /* ---------------- TOGGLE WISHLIST ---------------- */
  const toggleWishlist = async (variantCode) => {
    if (!userId) return alert("Please login to add items to your wishlist.");
    if (loadingWishlistAction) return;

    setLoadingWishlistAction(true);

    try {
      if (wishlistedCodes.has(variantCode)) {
        await axios.post("/api/wishlist/remove", {
          userId,
          productId: product._id,
          variantCode,
        });

        const next = new Set(wishlistedCodes);
        next.delete(variantCode);
        setWishlistedCodes(next);
      } else {
        await axios.post("/api/wishlist/add", {
          userId,
          productId: product._id,
          variantCode,
        });

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
      {/* ===== BREADCRUMB ===== */}
      <div className="mb-4 text-sm text-gray-600">
        <Link to="/" className="hover:underline">Home</Link>
        <span className="mx-2">/</span>
        <Link
          to={`/products/catalogue/${product.category}`}
          className="hover:underline"
        >
          {product.category}
        </Link>
        <span className="mx-2">/</span>
        <span className="font-medium text-gray-800">{product.name}</span>
      </div>

      {/* ===== BACK ===== */}
      <button
        onClick={() => navigate(`/products/catalogue/${product.category}`)}
        className="mb-6 text-blue-600 hover:underline"
      >
        ← Back to {product.category}
      </button>

      <div className="flex flex-col md:flex-row gap-10">
        {/* LEFT IMAGE */}
        <div className="md:w-1/2 w-full space-y-6">
          <div
            ref={imgContainerRef}
            className="w-full h-[400px] md:h-[500px] bg-white rounded shadow overflow-hidden flex items-center justify-center"
          >
            <img
              ref={imgRef}
              src={
                selectedVariant?.imageUrl ||
                selectedVariant?.data?.imageUrl ||
                "/placeholder.webp"
              }
              alt={product.name}
              className="max-h-full max-w-full object-contain transition-transform duration-200"
              onError={(e) => (e.target.src = "/placeholder.webp")}
            />
          </div>

          <p className="text-center text-gray-600">
            Showing image for:{" "}
            <b>{selectedVariant?.data?.["Code #"] || "-"}</b>
          </p>
        </div>

        {/* RIGHT DETAILS */}
        <div className="md:w-1/2 w-full">
          <h1 className="text-2xl md:text-3xl font-bold">{product.name}</h1>
          <p className="text-gray-500 mb-4">{product.category}</p>

          <Link to="/wishlist" className="text-yellow-600 underline mb-4 block">
            Go to Wishlist
          </Link>

          {/* ===== VARIANTS TABLE ===== */}
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full text-sm md:text-base border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-3 border font-semibold">Image</th>
                  <th className="px-2 py-3 border" />
                  {variantKeys.map((key) => (
                    <th key={key} className="px-4 py-3 border font-semibold">
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {product.variants.map((variant, idx) => {
                  const code =
                    variant.code ||
                    variant.data?.["Code #"] ||
                    variant?._id?.slice(-6) ||
                    "-";

                  const isWishlisted = wishlistedCodes.has(code);

                  return (
                    <tr
                      key={idx}
                      onClick={() => setSelectedVariant(variant)}
                      className={`cursor-pointer transition border-t
                        ${
                          selectedVariant === variant
                            ? "bg-yellow-100"
                            : idx % 2 === 0
                            ? "bg-gray-50"
                            : "bg-white"
                        } hover:bg-yellow-50`}
                    >
                      {/* IMAGE */}
                      <td className="px-3 py-2 border text-center">
                        <img
                          src={
                            variant?.imageUrl ||
                            variant?.data?.imageUrl ||
                            "/placeholder.webp"
                          }
                          alt={code}
                          className="h-12 w-12 object-cover rounded border mx-auto"
                          onError={(e) => (e.target.src = "/placeholder.webp")}
                        />
                      </td>

                      {/* WISHLIST (NO HEADER) */}
                      <td className="px-2 py-2 border text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWishlist(code);
                          }}
                          className="text-xl hover:scale-110 transition"
                        >
                          {isWishlisted ? "❤️" : "🤍"}
                        </button>
                      </td>

                      {/* DATA */}
                      {variantKeys.map((key) => (
                        <td
                          key={key}
                          className="px-4 py-3 border whitespace-nowrap"
                        >
                          {variant?.data?.[key] || "-"}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* DESCRIPTION */}
          {product.description && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold">Description</h3>
              <p>{product.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
