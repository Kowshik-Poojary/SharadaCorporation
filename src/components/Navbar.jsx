import { NavLink, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "../utils/axiosInstance";
import { Menu, X } from "lucide-react";
import Sharda from "../assets/Sharda.png";

const Navbar = ({ user, setUser }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const [wishlistCount, setWishlistCount] = useState(0);

  /* --------------------------------------------
     Fetch Wishlist Count
  -------------------------------------------- */
  useEffect(() => {
    const fetchWishlist = async () => {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (!storedUser?._id) {
        setWishlistCount(0);
        return;
      }

      try {
        const res = await axios.get(`/api/wishlist/${storedUser._id}`);
        setWishlistCount(res.data.length);
      } catch (err) {
        console.error("Wishlist fetch error:", err);
      }
    };

    fetchWishlist();
  }, [user]);

  /* --------------------------------------------
     Listen for wishlist updates (add/remove)
  -------------------------------------------- */
  useEffect(() => {
    const update = () => {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser?._id) {
        axios.get(`/api/wishlist/${storedUser._id}`).then((res) => {
          setWishlistCount(res.data.length);
        });
      }
    };

    window.addEventListener("wishlistUpdated", update);
    return () => window.removeEventListener("wishlistUpdated", update);
  }, []);

  /* --------------------------------------------
     Nav Links
  -------------------------------------------- */
  const links = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "CSR", path: "/csr" },
    { name: "Products", path: "/products/catalogue" },
    { name: "Catalogue", path: "/catalogue" },
    { name: "Gallery", path: "/gallery" },
    { name: "Contact Us", path: "/contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#380f0e] text-white shadow-md h-20">
      <div className="container mx-auto flex justify-between items-center p-4">

        {/* LOGO */}
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-3 cursor-pointer"
        >
          <img
            src={Sharda}
            alt="Sharda Corporation Logo"
            className="w-12 h-12 object-contain rounded-full bg-white p-1"
          />
          <span className="text-2xl font-bold tracking-wide">
            Sharda Corporation
          </span>
        </div>

        {/* DESKTOP NAVIGATION */}
        <ul className="hidden md:flex space-x-6">
          {links.map((link) => (
            <li
              key={link.name}
              className="relative group cursor-pointer pb-1 transition duration-300 text-lg"
            >
              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  `${isActive ? "text-yellow-400" : "hover:text-yellow-400"}`
                }
              >
                {link.name}
              </NavLink>
              <span className="absolute left-0 bottom-0 h-[2px] bg-white w-0 group-hover:w-full transition-all duration-300"></span>
            </li>
          ))}
        </ul>

        {/* ❤️ WISHLIST (DESKTOP ONLY) */}
        {user && (
          <button
            onClick={() => navigate("/wishlist")}
            className="hidden md:flex relative text-lg hover:text-yellow-400 transition"
          >
            ❤️ Wishlist
            {wishlistCount > 0 && (
              <span className="absolute -top-2 -right-4 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {wishlistCount}
              </span>
            )}
          </button>
        )}

        {/* LOGIN / LOGOUT (DESKTOP) */}
        {user ? (
          <button
            onClick={() => {
              localStorage.removeItem("user");
              setUser(null);
              navigate("/");
            }}
            className="hidden md:block bg-yellow-500 text-black px-4 py-2 rounded-lg hover:bg-yellow-400 transition"
          >
            Logout
          </button>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="hidden md:block bg-white text-red-950 px-4 py-2 rounded-lg hover:bg-yellow-300 transition"
          >
            Login
          </button>
        )}

        {/* ADMIN PANEL (DESKTOP) */}
        {user?.isAdmin && (
          <button
            onClick={() => navigate("/admin")}
            className="hidden md:block bg-green-500 text-black px-4 py-2 rounded-lg hover:bg-green-400 transition mr-3"
          >
            Admin Panel
          </button>
        )}

        {/* MOBILE HAMBURGER */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {isOpen && (
        <div className="md:hidden bg-[#380f0e] px-6 pb-4">
          <ul className="flex flex-col space-y-4">

            {/* NAVIGATION LINKS */}
            {links.map((link) => (
              <li key={link.name}>
                <NavLink
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `block text-lg ${isActive ? "text-yellow-400" : "hover:text-yellow-400"}`
                  }
                >
                  {link.name}
                </NavLink>
              </li>
            ))}

            {/* ❤️ WISHLIST — BEFORE LOGIN/LOGOUT */}
            {user && (
              <li
                onClick={() => {
                  setIsOpen(false);
                  navigate("/wishlist");
                }}
                className="flex items-center gap-2 cursor-pointer text-lg hover:text-yellow-400 transition"
              >
                ❤️ Wishlist
                {wishlistCount > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {wishlistCount}
                  </span>
                )}
              </li>
            )}

            {/* LOGIN / LOGOUT BUTTON */}
            <li>
              {user ? (
                <button
                  onClick={() => {
                    localStorage.removeItem("user");
                    setUser(null);
                    setIsOpen(false);
                    navigate("/");
                  }}
                  className="w-full bg-yellow-500 text-black px-4 py-2 rounded-lg hover:bg-yellow-400 transition"
                >
                  Logout
                </button>
              ) : (
                <button
                  onClick={() => {
                    setIsOpen(false);
                    navigate("/login");
                  }}
                  className="w-full bg-white text-red-950 px-4 py-2 rounded-lg hover:bg-yellow-300 transition"
                >
                  Login
                </button>
              )}
            </li>

            {/* ADMIN PANEL (MOBILE) */}
            {user?.isAdmin && (
              <li>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    navigate("/admin");
                  }}
                  className="w-full bg-green-500 text-black px-4 py-2 rounded-lg hover:bg-green-400 transition"
                >
                  Admin Panel
                </button>
              </li>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
