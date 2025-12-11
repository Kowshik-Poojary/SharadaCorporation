// src/components/Catalogues.jsx
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import LoadingBar from "react-top-loading-bar";
import { BaseUrl } from "../../constant";

const Catalogues = ({ user }) => {
  const navigate = useNavigate();
  const loaderRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRequest = async () => {
    const userEmail = user?.email || user?.user?.email;

    if (!userEmail) {
      toast.error("Please log in to request the catalogue.");
      navigate("/login");
      return;
    }

    try {
      setIsLoading(true);
      loaderRef.current.continuousStart();

      const response = await fetch(`${BaseUrl}/api/catalogue/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userEmail }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || "Catalogue request sent successfully!");
      } else {
        toast.error(data.message || "Failed to send catalogue request.");
      }
    } catch (error) {
      console.error("Error sending request:", error);
      toast.error("Error sending request. Try again later.");
    } finally {
      setIsLoading(false);
      loaderRef.current.complete();
    }
  };

  return (
    <div className="p-10 text-center relative">
      {/* 🔹 Top Loading Bar */}
      <LoadingBar color="#facc15" ref={loaderRef} height={4} />

      {/* 🔹 Toast Notifications */}
      <Toaster position="top-center" reverseOrder={false} />

      <h1 className="text-3xl font-bold">Explore our catalogues</h1>
      <p className="mt-4 text-gray-700">Sharda Corporation</p>

      <button
        onClick={handleRequest}
        disabled={!(user?.email || user?.user?.email) || isLoading}
        className={`mt-6 px-6 py-3 rounded-lg font-semibold text-white transition ${
          user?.email || user?.user?.email
            ? isLoading
              ? "bg-blue-400 cursor-wait"
              : "bg-blue-600 hover:bg-blue-700"
            : "bg-gray-400 cursor-not-allowed"
        }`}
      >
        {isLoading
          ? "Sending..."
          : user?.email || user?.user?.email
          ? "Request Catalogue"
          : "Login to Request"}
      </button>
    </div>
  );
};

export default Catalogues;
