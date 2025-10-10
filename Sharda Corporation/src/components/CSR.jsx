import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ✅ Import all 16 CSR images from src/assets
import CSR1 from "../assets/CSR1.jpg";
import CSR2 from "../assets/CSR2.jpg";
import CSR3 from "../assets/CSR3.jpg";
import CSR4 from "../assets/CSR4.jpg";
import CSR5 from "../assets/CSR5.jpg";
import CSR6 from "../assets/CSR6.jpg";
import CSR7 from "../assets/CSR7.jpg";
import CSR8 from "../assets/CSR8.jpg";
import CSR9 from "../assets/CSR9.jpg";
import CSR10 from "../assets/CSR10.jpg";
import CSR11 from "../assets/CSR11.jpg";
import CSR12 from "../assets/CSR12.jpg";
import CSR13 from "../assets/CSR13.jpg";
import CSR14 from "../assets/CSR14.jpg";
import CSR15 from "../assets/CSR15.jpg";


// Create array for easy mapping
const csrImages = [
  { id: 1, src: CSR1, alt: "CSR Activity 1" },
  { id: 2, src: CSR2, alt: "CSR Activity 2" },
  { id: 3, src: CSR3, alt: "CSR Activity 3" },
  { id: 4, src: CSR4, alt: "CSR Activity 4" },
  { id: 5, src: CSR5, alt: "CSR Activity 5" },
  { id: 6, src: CSR6, alt: "CSR Activity 6" },
  { id: 7, src: CSR7, alt: "CSR Activity 7" },
  { id: 8, src: CSR8, alt: "CSR Activity 8" },
  { id: 9, src: CSR9, alt: "CSR Activity 9" },
  { id: 10, src: CSR10, alt: "CSR Activity 10" },
  { id: 11, src: CSR11, alt: "CSR Activity 11" },
  { id: 12, src: CSR12, alt: "CSR Activity 12" },
  { id: 13, src: CSR13, alt: "CSR Activity 13" },
  { id: 14, src: CSR14, alt: "CSR Activity 14" },
  { id: 15, src: CSR15, alt: "CSR Activity 15" },
  { id: 16, src: CSR16, alt: "CSR Activity 16" },
];

const CSRPage = () => {
  const [selectedImg, setSelectedImg] = useState(null);

  return (
    <div className="p-6 md:p-12 bg-gray-50 min-h-screen">
      <h1 className="text-3xl md:text-4xl font-bold mb-10 text-center text-gray-800">
        Our Social Responsibilities
      </h1>

      {/* ✅ Image Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {csrImages.map((img) => (
          <motion.div
            key={img.id}
            whileHover={{ scale: 1.05 }}
            className="cursor-pointer overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-shadow"
            onClick={() => setSelectedImg(img.src)}
          >
            <img
              src={img.src}
              alt={img.alt}
              className="w-full h-64 object-cover transition duration-300"
              loading="lazy"
            />
          </motion.div>
        ))}
      </div>

      {/* ✅ Lightbox */}
      <AnimatePresence>
        {selectedImg && (
          <motion.div
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImg(null)}
          >
            <motion.img
              src={selectedImg}
              alt="CSR Zoom"
              className="max-w-[90%] max-h-[90%] rounded-lg shadow-2xl border border-white"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ✅ Text Section */}
      <div className="mt-16 max-w-5xl mx-auto bg-white rounded-2xl shadow-md p-8">
        <p className="text-gray-700 leading-relaxed text-lg md:text-xl mb-6">
          As our company has grown and spread its operations, we have become
          socially conscious and have started to work towards the betterment of
          people. Associated with many charitable activities, we try and
          maintain a balance between corporate demands and social
          responsibilities. Listed below are our few endeavors in brief:
        </p>

        <ul className="list-disc list-inside space-y-3 text-gray-700 leading-relaxed text-lg md:text-xl">
          <li>
            In the year 2011, we arranged for the marriage of 6 couples in a
            tribal area and sponsored their household needs.
          </li>
          <li>
            Since the last 18 years, we have sponsored annual eye check-ups
            where more than 21,500 people have been tested so far.
          </li>
          <li>
            Up till 2023, about 3,050 people have had cataract operations free
            of charge.
          </li>
          <li>
            Besides this, about 400 patients with critical eye problems have
            been operated on. More than 18 people have benefitted from eye
            donations and recovered vision.
          </li>
          <li>About 10,000 spectacles have been distributed to the needy persons.</li>
          <li>From annual blood donation camps we have managed to collect 520 bottles of blood.</li>
          <li>We have also set up a school in a tribal area and are currently sponsoring 30 students.</li>
          <li>We provide scholarships to the children of our staff members as well as to other poor students too.</li>
          <li>In the year 2019, we donated hearing aid machines to more than 50 patients.</li>
          <li>In the years 2016 & 2017, we started doing full body health checkups and checked around 1,500 people.</li>
          <li>Since the past 2 years, we have donated to 8 schools and sponsored e-learning for 1,000 students.</li>
          <li>In the years 2018 & 2019, we sponsored tuition fees for 203 students.</li>
          <li>In the year 2021, we donated around 3,000 Made-in-India Covid vaccines to the general public free of cost.</li>
        </ul>
      </div>
    </div>
  );
};

export default CSRPage;
