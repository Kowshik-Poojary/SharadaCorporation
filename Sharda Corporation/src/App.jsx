// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

// Import page components
import Home from "./components/Home";
import About from "./components/About";
import CSR from "./components/CSR";
import Products from "./components/Products";
import Catalogues from "./components/Catalogues";
import Gallerys from "./components/Gallerys";
import Contact from "./components/Contact";
import Footer from "./components/footer";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <Navbar />

      {/* Routes */}
      <div className="flex-grow">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/csr" element={<CSR />} />
        <Route path="/products" element={<Products />} />
        <Route path="/catalogue" element={<Catalogues />} />
        <Route path="/gallery" element={<Gallerys />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
      </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
