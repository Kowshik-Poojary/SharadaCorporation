import React from "react";
import { Mail, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#2b0908] text-gray-200 py-10 mt-10">
      <div className="container mx-auto px-6 grid md:grid-cols-3 gap-8 items-center text-center md:text-left">
        
        {/* Left - Brand Info */}
        <div>
          <h2 className="text-2xl font-semibold text-white mb-2">
            Sharda Corporation
          </h2>
          <p className="text-sm text-gray-400">
            A legacy of stainless steel excellence, trusted globally since 1978.
          </p>
        </div>

        {/* Middle - Navigation Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-yellow-400">Quick Links</h3>
          <ul className="space-y-2">
            <li className="hover:text-yellow-400 transition cursor-pointer">
              Privacy Policy
            </li>
            <li className="hover:text-yellow-400 transition cursor-pointer">
              Terms & Conditions
            </li>
            <li className="hover:text-yellow-400 transition cursor-pointer">
              Support
            </li>
          </ul>
        </div>

        {/* Right - Contact & Socials */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-yellow-400">Contact Us</h3>
          <p className="flex justify-center md:justify-start items-center gap-2">
            <Mail size={16} /> info@shardacorporation.com
          </p>
          <p className="flex justify-center md:justify-start items-center gap-2">
            <Phone size={16} /> +91-22425238/39/40
          </p>

          
        </div>
      </div>

      {/* Bottom line */}
      <div className="border-t border-gray-700 mt-8 pt-4 text-center text-sm text-gray-400">
        <p>© {new Date().getFullYear()} Sharda Corporation. All Rights Reserved.</p>
        <p className="text-xs mt-1">
          Made by <span className="text-yellow-400">Kowshik Poojary</span>,{" "}
          <span className="text-yellow-400">Tanmay Pirdankar</span> &{" "}
          <span className="text-yellow-400">Neal Mudaliar</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
