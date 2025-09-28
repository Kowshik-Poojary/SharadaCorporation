
import React, { useState } from "react";

const Navbar = () => {

   const [activeLink, setActiveLink] = useState("Home"); // default active page

  const links = ["Home", "About Us", "CSR", "Products","Catalogue","Gallery","Contact Us"];

  return (
    <nav className="bg-[#380f0e] text-white shadow-md h-20">
      <div className="container mx-auto flex justify-between items-center p-4">
        {/* Logo / Brand */}
        <h1 className="text-2xl font-bold">Sharda Corporation</h1>

        {/* Navigation Links */}
         <ul className="flex space-x-6">
          {links.map((link) => (
            <li
              key={link}
              className={`relative cursor-pointer pb-1 transition duration-300 
                ${activeLink === link ? "text-yellow-400" : "hover:text-yellow-400"}`}
              onClick={() => setActiveLink(link)}
            >
              {link}

              {/* White slider underline */}
              <span
                className={`absolute left-0 bottom-0 h-[2px] bg-white transition-all duration-300
                  ${activeLink === link ? "w-full" : "w-0 group-hover:w-full"}`}
              ></span>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
