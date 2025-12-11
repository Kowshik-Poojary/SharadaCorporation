import React from "react";
import { NavLink } from "react-router-dom";
import { Package, FolderKanban, Image as ImageIcon } from "lucide-react";
import AdminLayout from "./AdminLayout";

export default function AdminDashboard() {
  const cards = [
    {
      title: "Products",
      desc: "Create, edit & delete products.",
      icon: <Package className="h-10 w-10 text-yellow-600" />,
      link: "/admin/products",
    },
    {
      title: "Categories",
      desc: "Manage product categories.",
      icon: <FolderKanban className="h-10 w-10 text-blue-600" />,
      link: "/admin/categories",
    },
    {
      title: "Images",
      desc: "Upload product & variant images.",
      icon: <ImageIcon className="h-10 w-10 text-green-600" />,
      link: "/admin/upload-images",
    },
  ];

  return (
    <AdminLayout>
      <h1 className="text-4xl font-bold mb-3">Admin Dashboard</h1>
      <p className="text-gray-600">Manage products, categories & images.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {cards.map((item, i) => (
          <NavLink
            key={i}
            to={item.link}
            className="bg-white p-6 rounded-xl shadow hover:shadow-xl transition shadow-md 
                     border border-gray-200 hover:border-yellow-400 transform hover:-translate-y-1"
          >
            <div className="flex items-center space-x-4">
              {item.icon}
              <div>
                <h2 className="text-2xl font-semibold">{item.title}</h2>
                <p className="text-gray-500 mt-1">{item.desc}</p>
              </div>
            </div>

            <button className="mt-4 w-full bg-yellow-500 text-black font-semibold py-2 rounded-lg 
                               hover:bg-yellow-600 transition">
              Open {item.title}
            </button>
          </NavLink>
        ))}
      </div>
    </AdminLayout>
  );
}
