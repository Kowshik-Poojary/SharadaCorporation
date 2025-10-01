import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Globe, Award, Heart, BookOpen, Eye, Droplet } from "lucide-react";
import AboutBanner from "../assets/AboutBanner.png";

const AboutUs = () => {
  const { scrollYProgress } = useScroll();

  const timelineItems = [
    { year: " 1978", text: "Established as Merchant Exporters" },
    { year: " 1990s", text: "International Exhibitions & Recognition" },
    { year: " 2000s", text: "Awarded Export House Status" },
    { year: " Today", text: "Trusted in USA, Europe & Far East" }
  ];

  // Map scrollYProgress to opacity/translateX for each item
  const getOpacity = (index) =>
    useTransform(scrollYProgress, [0.1 * index, 0.1 * (index + 1)], [0, 1]);

  const getX = (index) =>
    useTransform(scrollYProgress, [0.1 * index, 0.1 * (index + 1)], [-50, 0]);

  return (
    <div className="bg-gray-50 text-gray-800">
      {/* 1️⃣ Hero Section */}
      <section className="relative w-full h-auto flex-shrink-0 flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${AboutBanner})` }}>
        <div className="absolute inset-0 bg-gray-400 bg-opacity-45"></div>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 text-center text-white px-6 pb-96 pt-60">
          <h1 className="text-5xl font-bold">Serving Quality Since 1978</h1>
          <p className="mt-4 text-xl max-w-3xl mx-auto">
            A legacy of stainless steel excellence, trusted globally for over 40 years.
          </p>
          <span className="mt-10 inline-block bg-yellow-500 text-black px-4 py-2 rounded-full font-semibold">
            40+ Years of Trust
          </span>
        </motion.div>
      </section>

      {/* 2️⃣ Timeline Section */}
      <section className="py-16 bg-white">
      <h2 className="text-4xl font-bold text-center mb-12">Our Journey</h2>
      <div className="max-w-4xl mx-auto">
        <ul className="relative border-l border-gray-300">
          {timelineItems.map((item, i) => {
            const opacity = getOpacity(i);
            const x = getX(i);
            return (
              <motion.li
                key={i}
                style={{ opacity, x }}
                className="mb-10 ml-6 relative"
              >
                <span className="absolute -left-3 flex items-center justify-center w-6 h-6 bg-yellow-500 rounded-full ring-8 ring-white"></span>
                <h3 className="font-bold text-xl p-4">{item.year}</h3>
                <p className="mt-2 text-gray-600">{item.text}</p>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>

      {/* 3️⃣ Who We Serve */}
      <section className="py-16 bg-gray-100">
        <h2 className="text-4xl font-bold text-center mb-12">Who We Serve</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto px-6">
          <motion.div whileHover={{ scale: 1.05 }} className="bg-white p-8 rounded-2xl shadow-lg">
            <h3 className="text-2xl font-semibold mb-4">👩‍🍳 Homemakers</h3>
            <p>Providing durable, stylish, and quality utensils to make every home kitchen complete.</p>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} className="bg-white p-8 rounded-2xl shadow-lg">
            <h3 className="text-2xl font-semibold mb-4">🍽️ Hospitality</h3>
            <p>Supplying premium cutlery and kitchenware to 5-star hotels and global restaurants.</p>
          </motion.div>
        </div>
      </section>

      {/* 4️⃣ CSR Section */}
      <section className="py-16 bg-white">
        <h2 className="text-4xl font-bold text-center mb-12">Circle of Life – CSR</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 max-w-5xl mx-auto px-6">
          {[
            { icon: <Eye className="w-10 h-10 text-yellow-500" />, text: "Free Eye Checkups & Surgeries" },
            { icon: <Droplet className="w-10 h-10 text-red-500" />, text: "Blood Donation Drives" },
            { icon: <BookOpen className="w-10 h-10 text-blue-500" />, text: "Sponsoring Education for 30+ Students" },
            { icon: <Award className="w-10 h-10 text-green-500" />, text: "Employee Scholarships" },
            { icon: <Heart className="w-10 h-10 text-pink-500" />, text: "Tribal Weddings & Community Support" },
          ].map((csr, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="bg-gray-50 p-6 rounded-xl shadow text-center"
            >
              <div className="flex justify-center mb-4">{csr.icon}</div>
              <p>{csr.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 5️⃣ Global Reach */}
      <section className="py-16 bg-gray-100 text-center">
        <h2 className="text-4xl font-bold mb-6">Our Global Presence</h2>
        <p className="max-w-2xl mx-auto mb-8 text-gray-600">
          From Mumbai to the world, our exports reach USA, Europe, and the Far East.
        </p>
        <Globe className="w-24 h-24 mx-auto text-blue-600" />
      </section>

      {/* 6️⃣ Closing */}
      <section className="py-20 bg-gray-100 text-black text-center">
        <motion.blockquote
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="text-2xl italic max-w-3xl mx-auto"
        >
          “We don’t just sell utensils. We serve trust, quality, and relationships – since 1978.”
        </motion.blockquote>
      </section>
    </div>
  );
};

export default AboutUs;
