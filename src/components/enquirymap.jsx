import React, { useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import toast, { Toaster } from "react-hot-toast";
import LoadingBar from "react-top-loading-bar";
import Warehouse from "../assets/warehouse.svg";
import office from "../assets/office.svg";

// Custom marker icons
const officeIcon = new L.Icon({
  iconUrl: office,
  iconSize: [32, 32],
});

const warehouseIcon = new L.Icon({
  iconUrl: Warehouse,
  iconSize: [32, 32],
});

const EnquiryMap = () => {
  const loaderRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    loaderRef.current.continuousStart();

    try {
      const res = await fetch("http://localhost:5000/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || "Enquiry submitted successfully!");
        setForm({ name: "", email: "", mobile: "", message: "" });
      } else {
        toast.error(data.message || "Error sending enquiry.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error. Try again later.");
    } finally {
      setIsLoading(false);
      loaderRef.current.complete();
    }
  };

  return (
    <div className="flex flex-col md:flex-row w-full p-4 gap-4">
      {/* 🔹 Top Loading Bar */}
      <LoadingBar color="#facc15" ref={loaderRef} height={4} />

      {/* 🔹 Toast Notifications */}
      <Toaster position="top-center" reverseOrder={false} />

      {/* Left Map Section */}
      <div className="relative w-full md:w-1/2 h-64 sm:h-72 md:h-80 lg:h-96 xl:h-[32rem] rounded-lg shadow-md overflow-hidden">
        <MapContainer
          center={[19.076, 72.8777]}
          zoom={12}
          scrollWheelZoom={true}
          className="w-full h-full rounded-lg"
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={[19.076, 72.8777]} icon={officeIcon}>
            <Popup>
              <b>Head Office</b>
              <br /> Mumbai, India
            </Popup>
          </Marker>
          <Marker position={[19.2183, 72.9781]} icon={warehouseIcon}>
            <Popup>
              <b>Warehouse</b>
              <br /> Thane, India
            </Popup>
          </Marker>
        </MapContainer>
      </div>

      {/* Right Form Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white shadow-lg rounded-xl p-6 space-y-4"
        >
          <h2 className="text-2xl font-bold text-center">Enquiry Form</h2>

          <input
            type="text"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-lg"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-lg"
          />

          <input
            type="tel"
            name="mobile"
            placeholder="Mobile No"
            value={form.mobile}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-lg"
          />

          <textarea
            name="message"
            placeholder="Message"
            rows="4"
            value={form.message}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-lg"
          />

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full p-3 rounded-lg text-red-950 bg-yellow-400 hover:bg-yellow-500 transition ${
              isLoading ? "cursor-wait opacity-70" : ""
            }`}
          >
            {isLoading ? "Sending..." : "Submit Enquiry"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EnquiryMap;
