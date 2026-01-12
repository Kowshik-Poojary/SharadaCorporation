// src/components/Home.jsx
import React from "react";
import EnquiryMap from "./enquirymap";

const Contact = () => {
  return (
    <div className="p-10 text-center bg-gray-50 min-h-screen">
      <h1 className="text-3xl md:text-4xl font-bold text-[#380f0e] mb-6">
        Welcome to Sharda Corporation
      </h1>

      <div className="mb-10">
        <EnquiryMap />
      </div>

      <h2 className="text-2xl font-semibold text-[#380f0e] mb-6">Address</h2>

      {/* Address Section */}
      <div className="flex flex-col md:flex-row justify-center gap-8 px-4">
        
        {/* Office Address */}
        <div className="bg-white shadow-lg rounded-2xl p-6 w-full md:w-1/3 border border-gray-200 hover:shadow-xl transition">
          <h3 className="text-xl font-semibold text-yellow-600 mb-2">Office</h3>
          <p className="font-medium text-[#380f0e] mb-1">Sharda Corporation</p>
          <p className="text-gray-700 text-sm leading-relaxed">
            1st Floor, Shrinivas CO.OP.HSG.CTY, LTD, <br />
            101-103, C.P. Tank Road, <br />
            Mumbai 400 004 (India)
          </p>
          <p className="text-gray-600 mt-2 text-sm">
            <span className="font-semibold">Tel:</span> +91-22425238 <br/>
            +91-2249601858 <br/>
            +91-9619854522
          </p>
        </div>

        {/* Warehouse Address */}
        <div className="bg-white shadow-lg rounded-2xl p-6 w-full md:w-1/3 border border-gray-200 hover:shadow-xl transition">
          <h3 className="text-xl font-semibold text-yellow-600 mb-2">Warehouse</h3>
          <p className="font-medium text-[#380f0e] mb-1">Sharda Corporation</p>
          <p className="text-gray-700 text-sm leading-relaxed">
            MLK Ind. Estate No.1, Gala No. 3, 4 & 5 <br />
            Behind Johnson Motors, <br />
            Near Range Office, Sativali Rd, Vasai (E), <br />
            Dist. Palghar, Pin Code: 401208 <br />
            Maharashtra, India
          </p>
          <p className="text-gray-600 mt-2 text-sm">
            <span className="font-semibold">Tel:</span> +91-8503516333 <br/>
            +91-8503516222
          </p>
        </div>
      </div>
    </div>
  );
};

export default Contact;
