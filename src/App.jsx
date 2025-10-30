// src/App.js
import { useState, useEffect } from "react";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Home from "./components/Home";
import About from "./components/About";
import CSR from "./components/CSR";
import Catalogues from "./components/Catalogues";
import Gallerys from "./components/Gallerys";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Products from "./components/Products";
import ProductDetail from "./components/ProductDetail";
import Loader from "./components/Loader";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ⏳ Show loader only once on initial page load
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  if (loading) return <Loader />;

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <ScrollToTop />
        <Navbar user={user} setUser={setUser} />
        <div className="flex-grow pt-20">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/csr" element={<CSR />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/catalogue" element={<Catalogues user={user} />} />
            <Route path="/gallery" element={<Gallerys />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

