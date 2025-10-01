import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const csrImages = [
  { id: 1, src: "/assets/csr1.jpg", alt: "CSR Activity 1" },
  { id: 2, src: "/assets/csr2.jpg", alt: "CSR Activity 2" },
  { id: 3, src: "/assets/csr3.jpg", alt: "CSR Activity 3" },
  { id: 4, src: "/assets/csr4.jpg", alt: "CSR Activity 4" },
];

const CSRPage = () => {
  const [selectedImg, setSelectedImg] = useState(null);

  return (
    <div className="p-6 md:p-12">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">
        Our CSR Initiatives
      </h1>

      {/* Image Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {csrImages.map((img) => (
          <motion.div
            key={img.id}
            whileHover={{ scale: 1.05 }}
            className="cursor-pointer overflow-hidden rounded-xl shadow-md"
            onClick={() => setSelectedImg(img.src)}
          >
            <img
              src={img.src}
              alt={img.alt}
              className="w-full h-64 object-cover transition duration-300"
            />
          </motion.div>
        ))}
      </div>

      {/* Lightbox */}
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
              className="max-w-[90%] max-h-[90%] rounded-lg shadow-lg"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Text Section */}
      <div className="mt-12 max-w-full mx-auto">
        <h2 className="text-4xl font-semibold mb-4 text-center">Our Commitment</h2>
        <p className="text-gray-600 leading-relaxed text-2xl mb-6">
        As our company has grown and spread its operations, we have become
        socially conscious and have started to work towards the betterment of
        people. Associated with many charitable activities, we try and maintain
        a balance between corporate demands and social responsibilities. Listed
        below are our few endeavors in brief:
      </p>

      <ul className="list-disc list-inside space-y-3 text-gray-600 leading-relaxed text-2xl mb-6">
        <li>
          In the year 2011, we arranged for the marriage of 6 couples in a
          tribal area and sponsored their household needs.
        </li>
        <li>
          Since the last 18 years, we have sponsored annual eye check-ups where
          more than 21,500 people have been tested so far.
        </li>
        <li>
          Up till 2023, about 3,050 people have had cataract operations free of
          charge.
        </li>
        <li>
          Besides this, about 400 patients with critical eye problems have been
          operated on. More than 18 people have benefitted from eye donations
          and recovered vision.
        </li>
        <li>
          About 10,000 spectacles have been distributed to the needy persons.
        </li>
        <li>
          From annual blood donation camps we have managed to collect 520
          bottles of blood.
        </li>
        <li>
          We have also set up a school in a tribal area and are currently
          sponsoring 30 students.
        </li>
        <li>
          We provide scholarships to the children of our staff members as well
          as to other poor students too.
        </li>
        <li>
          In the year 2019, we donated hearing aid machines to more than 50
          patients.
        </li>
        <li>
          In the years 2016 & 2017, we started doing full body health checkups
          and checked around 1,500 people, treating 50 people for various health
          problems.
        </li>
        <li>
          Since the past 2 years, we have donated to 8 schools and sponsored
          e-learning through our charitable trust, helping 1,000 students get
          education instruments & study books.
        </li>
        <li>
          In the years 2018 & 2019, we sponsored tuition fees for 203 students
          of grades 10th to 12th.
        </li>
        <li>
          In the year 2021, we donated around 3,000 Made-in-India Covid vaccines
          to the general public free of cost.
        </li>
      </ul>
      </div>
    </div>
  );
};

export default CSRPage;
