import { NavLink, useNavigate } from "react-router-dom";
import React from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const links = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "CSR", path: "/csr" },
    { name: "Products", path: "/products" },
    { name: "Catalogue", path: "/catalogue" },
    { name: "Gallery", path: "/gallery" },
    { name: "Contact Us", path: "/contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#380f0e] text-white shadow-md h-20">
      <div className="container mx-auto flex justify-between items-center p-4">
        {/* Logo */}
        <a href="/" className="text-2xl font-bold">
          Sharda Corporation
        </a>

        {/* Navigation Links */}
        <ul className="flex space-x-6">
          {links.map((link) => (
            <li
              key={link.name}
              className="relative group cursor-pointer pb-1 transition duration-300 text-lg"
            >
              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  `transition duration-300 ${
                    isActive ? "text-yellow-400" : "hover:text-yellow-400"
                  }`
                }
              >
                {link.name}
              </NavLink>

              {/* White underline (outside NavLink now) */}
              <span
                className="absolute left-0 bottom-0 h-[2px] bg-white w-0 group-hover:w-full transition-all duration-300"
              ></span>
            </li>
          ))}
        </ul>

        {/* Login Button */}
        <button
          onClick={() => navigate("/login")}
          className="bg-white text-red-950 px-4 py-2 rounded-lg hover:bg-yellow-300 transition"
        >
          Login
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
