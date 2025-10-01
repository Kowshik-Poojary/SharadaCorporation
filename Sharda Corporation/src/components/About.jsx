import React, { useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { Globe, Award, Heart, BookOpen, Eye, Droplet } from "lucide-react";
import AboutBanner from "../assets/AboutBanner.png";

const AboutUs = () => {
  const { scrollYProgress } = useScroll();
  const [showFullContent, setShowFullContent] = useState(false);
  const timelineItems = [
    { year: " 1978", text: "Established as Merchant Exporters" },
    { year: " 1990s", text: "International Exhibitions & Recognition" },
    { year: " 2000s", text: "Awarded Export House Status" },
    { year: " Today", text: "Trusted in USA, Europe & Far East" },
  ];

  // Map scrollYProgress to opacity/translateX for each item
  const getOpacity = (index) =>
    useTransform(scrollYProgress, [0.1 * index, 0.1 * (index + 1)], [0, 1]);

  const getX = (index) =>
    useTransform(scrollYProgress, [0.1 * index, 0.1 * (index + 1)], [-50, 0]);

  return (
    <div className="bg-gray-50 text-gray-800">
      {/* 1️⃣ Hero Section */}
      <section
        className="relative w-full h-auto flex-shrink-0 flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${AboutBanner})` }}
      >
        <div className="absolute inset-0 bg-gray-400 bg-opacity-45"></div>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 text-center text-white px-6 pb-96 pt-60"
        >
          <h1 className="text-5xl font-bold">Serving Quality Since 1978</h1>
          <p className="mt-4 text-xl max-w-3xl mx-auto">
            A legacy of stainless steel excellence, trusted globally for over 40
            years.
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
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white p-8 rounded-2xl shadow-lg"
          >
            <h3 className="text-2xl font-semibold mb-4">👩‍🍳 Homemakers</h3>
            <p>
              Providing durable, stylish, and quality utensils to make every
              home kitchen complete.
            </p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white p-8 rounded-2xl shadow-lg"
          >
            <h3 className="text-2xl font-semibold mb-4">🍽️ Hospitality</h3>
            <p>
              Supplying premium cutlery and kitchenware to 5-star hotels and
              global restaurants.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 4️⃣ CSR Section */}
      <section className="py-16 bg-white">
        <h2 className="text-4xl font-bold text-center mb-12">
          Circle of Life – CSR
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 max-w-5xl mx-auto px-6">
          {[
            {
              icon: <Eye className="w-10 h-10 text-yellow-500" />,
              text: "Free Eye Checkups & Surgeries",
            },
            {
              icon: <Droplet className="w-10 h-10 text-red-500" />,
              text: "Blood Donation Drives",
            },
            {
              icon: <BookOpen className="w-10 h-10 text-blue-500" />,
              text: "Sponsoring Education for 30+ Students",
            },
            {
              icon: <Award className="w-10 h-10 text-green-500" />,
              text: "Employee Scholarships",
            },
            {
              icon: <Heart className="w-10 h-10 text-pink-500" />,
              text: "Tribal Weddings & Community Support",
            },
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
        <div className="align-middle flex justify-center">
          <button
            onClick={() => setShowFullContent(true)}
            className="mt-6 bg-yellow-500 text-black px-6 py-3 rounded-full font-semibold hover:scale-105 transition-transform"
          >
            Read More
          </button>
        </div>
      </section>

      {/* 5 Full Content Overlay */}
      <AnimatePresence>
        {showFullContent && (
          <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/30 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5 }}
              className="relative bg-white w-full max-w-4xl h-[80vh] rounded-lg shadow-lg overflow-y-auto"
            >
              {/* Close button */}
              <button
                onClick={() => setShowFullContent(false)}
                className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600"
              >
                Close
              </button>

              {/* Content */}
              <div className="p-8">
                <h1 className="text-4xl font-bold mb-6">About Us</h1>
                <p className="mb-4">
                  Established in the year 1978, SHARDA CORPORATION is Merchant
                  Exporters – Trading Company exporting Stainless Steel
                  Utensils, Cutlery, Kitchenware and Household articles in
                  International Market. Satisfying customers for their stated
                  and implied needs has been always the Focus of Business Policy
                  of Sharda.
                </p>
                <p className="mb-4">
                  When you think of Steel utensils suppliers in Mumbai or
                  stainless steel utensils exporters in Mumbai we implore you to
                  go for the best quality products only! Sharda Corporation has
                  been firmly rooted in this industry for the past 40 years. It
                  is not merely a company but a family legacy that has been
                  passed on from each generation. Sharda Corporation ensures
                  quality in trading and supply of stainless steel kitchen
                  accessories. We were established in 1978 as merchant exporters
                  and trading company supplying stainless steel utensils,
                  cutlery, kitchenware and household articles.
                </p>
                <p className="mb-4">
                  A homemaker or the grand hospitality industry both use food
                  and accessories. They have to assemble or serve culinary
                  delights as a priority. As steel utensils suppliers in Mumbai
                  or stainless steel exporters in Mumbai we aim to provide all
                  that is required for a homemaker or the chef of a five star
                  kitchen. This is done to maximize their time, comfort and
                  requirements while churning out culinary delights. Right from
                  accessories that aid the cooking process to storage or
                  presentation of the final component we areinvolved. Sharda
                  Corporationis a supplier of stainless steel kitchen
                  accessories that provide comfort with class.
                </p>
                <p className="mb-4">
                  So still wondering what makes us so special? Since Sharda
                  Corporation aims at supplying the best only, we adhere to the
                  principles of Total Quantity Management striving for the zero
                  defect approach. Sharda Corporation ensures that as stainless
                  steel kitchenware suppliers all the stainless steel kitchen
                  accessories are subject to regular ISO audits. This is done
                  mainly to ensure uniformity in the supply of top quality
                  products. What started out as a humble beginning for Sharda
                  Corporation slowly gained momentum every decade. Our
                  commitment to good quality, lead management, supply timewas
                  our first step. Competitive pricing, good sourcing from
                  genuine factories and consistent quality checks have helped us
                  gain recognition locally and globally.
                </p>
                <p className="mb-4">
                  Sharda Corporation started as steel utensils suppliers in
                  Mumbai and went on achieve the tag of Steel utensils exporters
                  in Mumbai! We organised many exhibitions in India and abroad.
                  Why did we do this? Sharda Corporation believes that the way
                  to everybody’s heart is through their stomach so all that is
                  required to prepare delicacies or serve them must be equally
                  good. An exhibition organised by us was our way of reaching
                  out to millions in orderto promote awareness on quality while
                  showcasing stainless steel kitchen accessories. A committed
                  management and sincere hardworking employees enabled us to
                  improve export performance. Eventually this consistent
                  performance as stainless steel utensils exporters in Mumbai
                  got us a coveted recognition from Government of India,
                  Ministry of Commerce as an “Export House” for several years!
                  Our thrust markets are USA, Europe and Far East. We have had a
                  steady climb in the international market. Sharda Corporation
                  has escalated from being known as stainless steel utensils
                  exporters in Mumbai to a sought out recognised organisation.
                </p>
                <p className="mb-4">
                  Sharda Corporation strives to maintain competitive pricing so
                  that our products can find a place for themselves in every
                  kitchen or house. We ensure that we maintain our dedication to
                  supplying quality accessories as stainless steel exporters in
                  Mumbai. Sharda Corporation keeps in mind the comfort value of
                  the product along with utility that stainless steel cutlery
                  suppliers in India must be aware of. We also believe that
                  beauty not only lies in the eyes of the beholder but also in
                  the way the object is presented. For all those in the
                  hospitality sector where presentation and preparation gain
                  equal weightage Sharda Corporation supplies the best stainless
                  steel kitchen accessories.
                </p>
                <p className="mb-4">
                  As part of our dedication to supply chain management we strive
                  to establish and improve customer relations by supplying them
                  with the best. Our philosophy strives not only on customer
                  acquisition but also on customer retention. Our aim is to
                  increase the happiness, monetary value and satisfaction
                  mutually. We are steel utensils suppliers in Mumbai who are
                  also relationship savvy and dedicated.
                </p>
                <p className="mb-4">
                  We believe that life must come to a full circle. Where we
                  touch the lives of customers as steel utensils suppliers in
                  Mumbai we like to touch the heart of many by participating in
                  required social responsibility.
                </p>
                <p className="mb-4">
                  Since last 14 years we have sponsored eye check-ups, cataract
                  operation, critical eye operations, eye donations,
                  distribution of free spectacles, blood donation etc. Since
                  education empowers lives we set up a school in a tribal area
                  and are currently sponsoring 30 students. We provide
                  scholarship to children of our employees. We also arranged for
                  the wedding of six tribal couples. Since past two years we
                  have started doing complete body check ups and providing free
                  medical treatment to the critically needy. So the next time
                  you buy from us remember you are also empowering us to spread
                  more goodwill in the circle of life!
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 6 Global Reach */}
      <section className="py-16 bg-gray-100 text-center">
        <h2 className="text-4xl font-bold mb-6">Our Global Presence</h2>
        <p className="max-w-2xl mx-auto mb-8 text-gray-600">
          From Mumbai to the world, our exports reach USA, Europe, and the Far
          East.
        </p>
        <Globe className="w-24 h-24 mx-auto text-blue-600" />
      </section>

      {/* 7 Closing */}
      <section className="py-20 bg-gray-100 text-black text-center">
        <motion.blockquote
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="text-2xl italic max-w-3xl mx-auto"
        >
          “We don’t just sell utensils. We serve trust, quality, and
          relationships – since 1978.”
        </motion.blockquote>
      </section>
    </div>
  );
};

export default AboutUs;
