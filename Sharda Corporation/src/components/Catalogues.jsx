// src/components/Catalogues.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const Catalogues = ({ user }) => {
  const navigate = useNavigate();

  const handleRequest = async () => {
    const userEmail = user?.email || user?.user?.email; // handle both cases

    if (!userEmail) {
      alert("Please log in to request the catalogue.");
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/catalogue/request",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userEmail: user.email }),
        }
      );

      const data = await response.json();
      alert(data.message || "Catalogue request sent successfully!");
    } catch (error) {
      console.error("Error sending request:", error);
      alert("Error sending request. Try again later.");
    }
    console.log("User in Catalogues.jsx:", user);
  };

  return (
    <div className="p-10 text-center">
      <h1 className="text-3xl font-bold">Welcome to Sharda Corporation</h1>
      <p className="mt-4 text-gray-700">Explore our catalogues.</p>

      <button
        onClick={handleRequest}
        className={`mt-6 px-6 py-3 rounded-lg font-semibold text-white transition ${
          user?.email || user?.user?.email
            ? "bg-blue-600 hover:bg-blue-700"
            : "bg-gray-400 cursor-not-allowed"
        }`}
        disabled={!(user?.email || user?.user?.email)}
      >
        {user?.email || user?.user?.email
          ? "Request Catalogue"
          : "Login to Request"}
      </button>
    </div>
  );
};

export default Catalogues;
