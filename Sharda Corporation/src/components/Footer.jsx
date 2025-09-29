import React from "react";

const Footer = () => {
  return (
    <footer className="bg-[#380f0e] text-white py-6 mt-10">
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
        
        {/* Left - Brand */}
        <h2 className="text-xl font-bold">Sharda Corporation</h2>

        {/* Center - Links */}
        <ul className="flex space-x-6 my-4 md:my-0">
          <li className="hover:text-yellow-400 cursor-pointer">Privacy Policy</li>
          <li className="hover:text-yellow-400 cursor-pointer">Terms</li>
          <li className="hover:text-yellow-400 cursor-pointer">Support</li>
        </ul>

        {/* Right - Copyright */}
        <p className="text-gray-400 text-sm">
          © {new Date().getFullYear()} Sharda Corporation. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
