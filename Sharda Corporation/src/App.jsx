// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./components/Login";

// Import page components
import Home from "./components/Home";
import About from "./components/About";
import CSR from "./components/CSR";
import Products from "./components/Products";
import Catalogues from "./components/Catalogues";
import Gallerys from "./components/Gallerys";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        {/* Navbar */}
        <Navbar />

        {/* Routes */}
        <div className="flex-grow pt-20">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/csr" element={<CSR />} />
            <Route path="/products" element={<Products />} />
            <Route path="/catalogue" element={<Catalogues />} />
            <Route path="/gallery" element={<Gallerys />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/products/electronics"
              element={<Products category="Electronics" />}
            />
            <Route
              path="/products/furniture"
              element={<Products category="Furniture" />}
            />
            <Route
              path="/products/clothing"
              element={<Products category="Clothing" />}
            />
            <Route
              path="/products/accessories"
              element={<Products category="Accessories" />}
            />

          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
