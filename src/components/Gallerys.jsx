// src/components/Gallery.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Cloudinary data
const exhibitions = [
  {
    title: "Host Milano 2025",
    range: [1, 7],
    video: "https://res.cloudinary.com/dfcuvzjii/video/upload/v1760800655/ExhibitionVideo.mp4",
  },
  {
    title: "Ambiente Germany 2025",
    range: [8, 14],
  },
  {
    title: "Ambiente 2024",
    range: [15, 22],
  },
];

const warehouse = {
  range: [1, 12],
  video: "https://res.cloudinary.com/dfcuvzjii/video/upload/v1760810065/WarehouseVideo.mp4",
};

const generateImages = (prefix, start, end, baseUrl) => {
  return Array.from({ length: end - start + 1 }, (_, i) => ({
    type: "image",
    src: `${baseUrl}${prefix}${start + i}.jpg`,
  }));
};

const Gallery = () => {
  const [selectedImgIndex, setSelectedImgIndex] = useState(null);
  const [selectedSection, setSelectedSection] = useState([]);

  const handlePrev = (e) => {
    e.stopPropagation();
    setSelectedImgIndex(
      selectedImgIndex === 0 ? selectedSection.length - 1 : selectedImgIndex - 1
    );
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setSelectedImgIndex(
      selectedImgIndex === selectedSection.length - 1 ? 0 : selectedImgIndex + 1
    );
  };

  const openImage = (index, section) => {
    setSelectedSection(section);
    setSelectedImgIndex(index);
  };

  return (
    <div className="p-6 md:p-12 bg-gray-50 min-h-screen">
      <h1 className="text-3xl md:text-4xl font-bold mb-10 text-center text-gray-800">
        Gallery
      </h1>

      {/* === Exhibitions Section === */}
      <div className="max-w-7xl mx-auto">
        {exhibitions.map((event, idx) => {
          const baseUrl = "https://res.cloudinary.com/dfcuvzjii/image/upload/v1760800655/";
          const media = [
            ...generateImages("Exhibition", event.range[0], event.range[1], baseUrl),
          ];
          if (event.video) media.push({ type: "video", src: event.video });

          return (
            <div key={idx} className="mb-16">
              {/* Section Title */}
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6 border-b-4 border-gray-300 pb-2">
                {event.title}
              </h2>

              {/* Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {media.map((item, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    className="cursor-pointer overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-shadow bg-white"
                    onClick={() => openImage(index, media)}
                  >
                    {item.type === "image" ? (
                      <img
                        src={item.src}
                        alt={`Exhibition ${index + 1}`}
                        className="w-full h-64 object-cover transition duration-300"
                        loading="lazy"
                      />
                    ) : (
                      <video
                        src={item.src}
                        className="w-full h-64 object-cover rounded-xl"
                        muted
                      />
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Separator Line */}
              {idx < exhibitions.length - 1 && (
                <div className="my-12 border-t-2 border-gray-300"></div>
              )}
            </div>
          );
        })}
      </div>

      {/* === Warehouse Section === */}
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6 border-b-4 border-gray-300 pb-2">
          Warehouse
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...generateImages("Warehouse", warehouse.range[0], warehouse.range[1], "https://res.cloudinary.com/dfcuvzjii/image/upload/v1760802578/"),
            { type: "video", src: warehouse.video }].map((item, index, arr) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="cursor-pointer overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-shadow bg-white"
              onClick={() => openImage(index, arr)}
            >
              {item.type === "image" ? (
                <img
                  src={item.src}
                  alt={`Warehouse ${index + 1}`}
                  className="w-full h-64 object-cover transition duration-300"
                  loading="lazy"
                />
              ) : (
                <video
                  src={item.src}
                  className="w-full h-64 object-cover rounded-xl"
                  muted
                />
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* === Lightbox === */}
      <AnimatePresence>
        {selectedImgIndex !== null && (
          <motion.div
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImgIndex(null)}
          >
            {/* Prev Button */}
            <button
              onClick={handlePrev}
              className="absolute left-5 text-white text-3xl font-bold z-50"
            >
              &#10094;
            </button>

            {/* Image or Video */}
            {selectedSection[selectedImgIndex].type === "image" ? (
              <motion.img
                src={selectedSection[selectedImgIndex].src}
                alt="Zoomed"
                className="max-w-[90%] max-h-[90%] rounded-lg shadow-2xl border border-white"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
              />
            ) : (
              <motion.video
                src={selectedSection[selectedImgIndex].src}
                controls
                autoPlay
                className="max-w-[90%] max-h-[90%] rounded-lg shadow-2xl border border-white"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
              />
            )}

            {/* Next Button */}
            <button
              onClick={handleNext}
              className="absolute right-5 text-white text-3xl font-bold z-50"
            >
              &#10095;
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;
