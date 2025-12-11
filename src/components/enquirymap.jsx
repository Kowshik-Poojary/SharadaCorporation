import React, { useState, useRef, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  LayersControl,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import toast, { Toaster } from "react-hot-toast";
import LoadingBar from "react-top-loading-bar";
import Warehouse from "../assets/warehouse.svg";
import office from "../assets/office.svg";
import { BaseUrl } from "../../constant";

const officeIcon = new L.Icon({ iconUrl: office, iconSize: [32, 32] });
const warehouseIcon = new L.Icon({ iconUrl: Warehouse, iconSize: [32, 32] });
const { BaseLayer } = LayersControl;

const MapControls = ({ bounds }) => {
  const map = useMap();
  const controlAdded = useRef(false);

  useEffect(() => {
    if (controlAdded.current) return;

    const homeControl = L.control({ position: "topright" });
    homeControl.onAdd = function () {
      const div = L.DomUtil.create("div", "leaflet-bar leaflet-control");
      div.style.backgroundColor = "#fff";
      div.style.cursor = "pointer";
      div.style.padding = "6px 10px";
      div.style.fontSize = "16px";
      div.innerHTML = "🏠";
      div.title = "View Both Locations";
      div.onclick = () => map.fitBounds(bounds);
      return div;
    };
    homeControl.addTo(map);
    controlAdded.current = true;
  }, [map, bounds]);

  return null;
};

const EnquiryMap = ({ user }) => {
  const loaderRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    message: "",
  });

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  // fallback: try to read user from localStorage if parent didn't pass it

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Try from prop or localStorage
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const userEmail =
      user?.email ||
      user?.user?.email ||
      storedUser?.email ||
      storedUser?.user?.email;

    if (!userEmail) {
      toast.error("Please login before submitting enquiry.");
      setTimeout(() => (window.location.href = "/login"), 800);
      return;
    }

    setIsLoading(true);
    loaderRef.current?.continuousStart?.();

    try {
      const res = await fetch(`${BaseUrl}/api/enquiry`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // include userEmail in body so backend can associate
        body: JSON.stringify({ ...form, userEmail }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || "Enquiry submitted successfully!");
        setForm({ name: "", email: "", mobile: "", message: "" });
      } else {
        // backend responded with 4xx/5xx
        toast.error(data.message || "Failed to send enquiry.");
      }
    } catch (err) {
      console.error("Enquiry error:", err);
      toast.error("Server error. Try again later.");
    } finally {
      setIsLoading(false);
      loaderRef.current?.complete?.();
    }
  };

  const bounds = [
    [18.955694, 72.827072],
    [19.403531, 72.850531],
  ];

  return (
    <div className="flex flex-col md:flex-row w-full p-4 gap-4">
      <LoadingBar color="#facc15" ref={loaderRef} height={4} />
      <Toaster position="top-center" reverseOrder={false} />

      {/* Left Map Section */}
      <div className="relative w-full md:w-1/2 h-64 sm:h-72 md:h-80 lg:h-96 xl:h-[32rem] rounded-lg shadow-md overflow-hidden">
        <MapContainer
          bounds={bounds}
          scrollWheelZoom={true}
          className="w-full h-full rounded-lg"
        >
          <LayersControl position="topright">
            <BaseLayer checked name="Street View">
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            </BaseLayer>
            <BaseLayer name="Terrain View">
              <TileLayer url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png" />
            </BaseLayer>
            <BaseLayer name="Satellite View">
              <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
            </BaseLayer>
          </LayersControl>

          <Marker position={[18.955694, 72.827072]} icon={officeIcon}>
            <Popup>
              <div
                onClick={() =>
                  window.open(
                    "https://maps.app.goo.gl/UgiDPJcUjnUvZYBw5",
                    "_blank"
                  )
                }
                className="cursor-pointer text-center"
              >
                <b>Head Office,</b>
                <br />
                Mumbai <br />
                <span className="text-blue-600 underline">
                  Open in Google Maps
                </span>
              </div>
            </Popup>
          </Marker>

          <Marker position={[19.403531, 72.850531]} icon={warehouseIcon}>
            <Popup>
              <div
                onClick={() =>
                  window.open(
                    "https://maps.app.goo.gl/r6BRJWL3zVYXjftG7",
                    "_blank"
                  )
                }
                className="cursor-pointer text-center"
              >
                <b>Warehouse,</b>
                <br />
                Vasai <br />
                <span className="text-blue-600 underline">
                  Open in Google Maps
                </span>
              </div>
            </Popup>
          </Marker>

          <MapControls bounds={bounds} />
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
