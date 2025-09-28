// src/components/Navbar.jsx
import React from "react";

const Navbar = () => {
  return (
    <nav className="bg-[#380f0e] text-white shadow-md h-20">
      <div className="container mx-auto flex justify-between items-center p-4">
        {/* Logo / Brand */}
        <h1 className="text-2xl font-bold">Sharda Corporation</h1>

        {/* Navigation Links */}
        <ul className="flex space-x-6">
          <li className="hover:text-yellow-400 cursor-pointer">Home</li>
          <li className="hover:text-yellow-400 cursor-pointer">About Us</li>
          <li className="hover:text-yellow-400 cursor-pointer">CSR</li>
          <li className="hover:text-yellow-400 cursor-pointer">Products</li>
          <li className="hover:text-yellow-400 cursor-pointer">Catalogue</li>
          <li className="hover:text-yellow-400 cursor-pointer">Gallery</li>
          <li className="hover:text-yellow-400 cursor-pointer">Contact Us</li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
