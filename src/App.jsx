// src/App.js
import { useState, useEffect } from "react";
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import ScrollToTop from "./components/ScrollToTop";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Loader from "./components/Loader";

// Public Pages
import Login from "./components/Login";
import Home from "./components/Home";
import About from "./components/About";
import CSR from "./components/CSR";
import Catalogues from "./components/Catalogues";
import Gallerys from "./components/Gallerys";
import Contact from "./components/Contact";

import ProductCatalogue from "./pages/ProductCatalogue";
import ProductDetailView from "./pages/ProductDetailView";
import WishlistPage from "./components/Wishlistpage";

// Admin Pages (FINAL SET)
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminUploadImages from "./pages/admin/AdminUploadImages";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminAddProduct from "./pages/admin/AdminAddProduct";
import AdminAddVariant from "./pages/admin/AdminAddVariant";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Page Loader (Initial)
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(timer);
  }, []);

  // Load User from LocalStorage
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  if (loading) return <Loader />;

  // -------- Admin Protected Route --------
  const AdminRoute = ({ children }) => {
    if (!user || !user.isAdmin) return <Navigate to="/" replace />;
    return children;
  };

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <ScrollToTop />
        <Navbar user={user} setUser={setUser} />

        <div className="flex-grow pt-20">
          <Routes>
            {/* ---------- Public Routes ---------- */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/csr" element={<CSR />} />
            <Route path="/catalogue" element={<Catalogues user={user} />} />
            <Route path="/gallery" element={<Gallerys />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login setUser={setUser} />} />

            {/* Product Routes */}
            <Route path="/products/catalogue" element={<ProductCatalogue />} />
            <Route
              path="/products/catalogue/:categoryName"
              element={<ProductCatalogue />}
            />
            <Route
              path="/products/details/:id"
              element={<ProductDetailView />}
            />

            {/* Wishlist */}
            <Route path="/wishlist" element={<WishlistPage />} />

            {/* ---------- ADMIN PANEL ROUTES ---------- */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />

            <Route
              path="/admin/products"
              element={
                <AdminRoute>
                  <AdminProducts />
                </AdminRoute>
              }
            />

            <Route
              path="/admin/upload-images"
              element={
                <AdminRoute>
                  <AdminUploadImages />
                </AdminRoute>
              }
            />

            <Route
              path="/admin/categories"
              element={
                <AdminRoute>
                  <AdminCategories />
                </AdminRoute>
              }
            />

            {/* ADD PRODUCT PAGE */}
            <Route
              path="/admin/products/new"
              element={
                <AdminRoute>
                  <AdminAddProduct />
                </AdminRoute>
              }
            />

            {/* ADD VARIANT PAGE */}
            <Route
              path="/admin/products/add-variant"
              element={
                <AdminRoute>
                  <AdminAddVariant />
                </AdminRoute>
              }
            />
          </Routes>
        </div>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
