import React, { useRef, useCallback, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

// ─── STATIC DATA ───
const BEST_SELLERS = [
  { productName: "Mini Pail W/out Base S/S",        variantCode: "515",  productId: "6936611d250603c356106036" },
  { productName: "Balti Dish With Flat Beading",    variantCode: "1552", productId: "6936611d250603c35610605f" },
  { productName: "Sauce Cup (Ramekin)",             variantCode: "6145", productId: "6936611d250603c356105f09" },
  { productName: "Free Flow Pourer",                variantCode: "1678", productId: "6936611d250603c3561060d1" },
  { productName: "Chop Board Rack",                 variantCode: "1885", productId: "6936611d250603c3561061f5" },
  { productName: "Mixing Bowl Regular",             variantCode: "1501", productId: "6936611d250603c3561062a9" },
  { productName: "Mixing Bowl Reshma",              variantCode: "1502", productId: "6936611d250603c3561062b0" },
  { productName: "Mixing Bowl Nikken",              variantCode: "1503", productId: "6936611d250603c3561062a2" },
  { productName: "Chip Cup",                        variantCode: "6158", productId: "6936611d250603c356106008" },
  { productName: "Large Shaker With Plastic Lid",   variantCode: "1789", productId: "6936611d250603c3561060b9" },

  
  { productName: "Tapper Mixing Bowl",   variantCode: "1519", productId: "6936611d250603c356106298" },
  { productName: "Monalisa Cocktail Shaker",   variantCode: "1704", productId: "6936611d250603c356106175" },
  { productName: "Ash Tray Stracking",   variantCode: "1761", productId: "6936611d250603c356105f7a" },
  { productName: "Utility Tong Vinyl Coated-S.S",   variantCode: "6357", productId: "6936611d250603c35610644c" },
  { productName: "Serving Spoon PP Handle Black Color",   variantCode: "6551", productId: "6936611d250603c35610622f" },
  { productName: "Skimmer Wire Handle",   variantCode: "6644", productId: "6936611d250603c356106288" },
  { productName: "Wine Bucket Stand",   variantCode: "6879", productId: "6936611d250603c356105bf8" },
  { productName: "Wine Bucket Stand",   variantCode: "6880", productId: "6936611d250603c356105bf8" },
  { productName: "Menu Holder",   variantCode: "6890", productId: "6936611d250603c356105c12" },
];

const IMAGE_MAP = {
  "515":  new URL("../assets/best-sellers/515.jpeg",  import.meta.url).href,
  "1552": new URL("../assets/best-sellers/1552.jpeg", import.meta.url).href,
  "6145": new URL("../assets/best-sellers/6145.jpeg", import.meta.url).href,
  "1678": new URL("../assets/best-sellers/1678.jpg",  import.meta.url).href,
  "1885": new URL("../assets/best-sellers/1885.jpeg", import.meta.url).href,
  "1501": new URL("../assets/best-sellers/1501.jpeg", import.meta.url).href,
  "1502": new URL("../assets/best-sellers/1502.jpeg", import.meta.url).href,
  "1503": new URL("../assets/best-sellers/1503.jpeg", import.meta.url).href,
  "6158": new URL("../assets/best-sellers/6158.jpeg", import.meta.url).href,
  "1789": new URL("../assets/best-sellers/1789.jpg",  import.meta.url).href,
  
  "1519": new URL("../assets/best-sellers/1519.jpg",  import.meta.url).href,
  "1704": new URL("../assets/best-sellers/1704.jpg",  import.meta.url).href,
  "1761": new URL("../assets/best-sellers/1761.jpg",  import.meta.url).href,
  "6357": new URL("../assets/best-sellers/6357.jpg",  import.meta.url).href,
  "6551": new URL("../assets/best-sellers/6551.jpeg",  import.meta.url).href,
  "6644": new URL("../assets/best-sellers/6644.jpeg",  import.meta.url).href,
  "6879": new URL("../assets/best-sellers/6879.jpeg",  import.meta.url).href,
  "6880": new URL("../assets/best-sellers/6880.jpeg",  import.meta.url).href,
  "6890": new URL("../assets/best-sellers/6890.jpg",  import.meta.url).href,
};

// How many cards are visible at once (first N get eager loading)
const EAGER_COUNT = 4;

// Preload all images into browser disk cache — runs once at module level,
// not inside the component, so it survives re-mounts without re-fetching
const preloadCache = new Set();
Object.values(IMAGE_MAP).forEach((src, i) => {
  if (preloadCache.has(src)) return;
  preloadCache.add(src);
  const img = new Image();
  img.fetchPriority = i < EAGER_COUNT ? "high" : "low";
  if (i < EAGER_COUNT) {
    img.src = src; // Load immediately
  } else if ("requestIdleCallback" in window) {
    requestIdleCallback(() => { img.src = src; });
  } else {
    setTimeout(() => { img.src = src; }, 200 * (i - EAGER_COUNT));
  }
});

export default function BestSellerSlider() {
  const navigate    = useNavigate();
  const trackRef    = useRef(null);
  const positionRef = useRef(0);
  const isDragging  = useRef(false);
  const startX      = useRef(0);
  const scrollLeft  = useRef(0);
  const paused      = useRef(false);
  const rafRef      = useRef(null);

  // ─── Memoize doubled array — never recreated on re-render ───
  const slides = useMemo(() => [...BEST_SELLERS, ...BEST_SELLERS], []);

  /* ── AUTO SCROLL ── */
  const animate = useCallback(() => {
    const track = trackRef.current;
    if (!track || paused.current || isDragging.current) {
      rafRef.current = requestAnimationFrame(animate);
      return;
    }
    positionRef.current -= 0.6;
    if (Math.abs(positionRef.current) >= track.scrollWidth / 2) {
      positionRef.current = 0;
    }
    track.style.transform = `translateX(${positionRef.current}px)`;
    rafRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [animate]);

  /* ── DRAG / SWIPE ── */
  const onDragStart = (e) => {
    isDragging.current = true;
    paused.current     = true;
    trackRef.current.style.cursor = "grabbing";
    startX.current     = e.pageX ?? e.touches[0].pageX;
    scrollLeft.current = positionRef.current;
  };

  const onDragMove = (e) => {
    if (!isDragging.current) return;
    const x = e.pageX ?? e.touches[0].pageX;
    positionRef.current = scrollLeft.current + (x - startX.current);
    trackRef.current.style.transform = `translateX(${positionRef.current}px)`;
  };

  const onDragEnd = () => {
    isDragging.current = false;
    paused.current     = false;
    if (trackRef.current) trackRef.current.style.cursor = "grab";
  };

  /* ── RENDER ── */
  return (
    <div className="w-full px-4 sm:px-6 mt-12 flex flex-col items-center overflow-hidden">

      {/* TITLE */}
      <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-gray-900">
        ⭐ Best Sellers
      </h2>
      <div className="w-24 sm:w-32 h-1 bg-yellow-400 rounded-full mb-6" />

      {/* VIEWPORT */}
      <div className="w-full overflow-hidden">
        <div
          ref={trackRef}
          className="flex gap-4 sm:gap-6 will-change-transform cursor-grab select-none"
          onMouseDown={onDragStart}
          onMouseMove={onDragMove}
          onMouseUp={onDragEnd}
          onMouseLeave={onDragEnd}
          onTouchStart={onDragStart}
          onTouchMove={onDragMove}
          onTouchEnd={onDragEnd}
        >
          {slides.map((item, index) => (
            <div
              key={`${item.variantCode}-${index}`}
              onClick={() => navigate(`/products/details/${item.productId}`)}
              className="
                min-w-[180px] sm:min-w-[220px] lg:min-w-[240px]
                bg-white border border-gray-200 rounded-2xl p-3
                cursor-pointer transition-transform duration-300
                hover:scale-[1.03] hover:shadow-lg
              "
            >
              <img
                src={IMAGE_MAP[item.variantCode]}
                alt={item.productName}
                // First EAGER_COUNT cards load immediately, rest lazy
                loading={index < EAGER_COUNT ? "eager" : "lazy"}
                decoding={index < EAGER_COUNT ? "sync" : "async"}
                fetchPriority={index < EAGER_COUNT ? "high" : "low"}
                className="h-32 sm:h-36 lg:h-40 w-full object-contain bg-white rounded-xl"
              />
              <h3 className="text-sm sm:text-base lg:text-lg font-semibold mt-3 text-gray-900 truncate">
                {item.productName}
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                {item.variantCode}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}