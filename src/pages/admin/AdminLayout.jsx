import React from "react";
import { NavLink } from "react-router-dom";

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-[#222] text-white p-6 space-y-6 shadow-lg">
        <h2 className="text-2xl font-bold">Admin Panel</h2>

        <nav className="flex flex-col space-y-3">
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `px-4 py-2 rounded ${
                isActive ? "bg-yellow-500 text-black" : "hover:bg-gray-700"
              }`
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/admin/products"
            className={({ isActive }) =>
              `px-4 py-2 rounded ${
                isActive ? "bg-yellow-500 text-black" : "hover:bg-gray-700"
              }`
            }
          >
            Products
          </NavLink>

          {/* Add Product */}
          <NavLink
            to="/admin/products/new"
            className={({ isActive }) =>
              `px-4 py-2 rounded ${
                isActive ? "bg-yellow-300 text-black" : "hover:bg-gray-700"
              }`
            }
          >
            ➕ Add Product
          </NavLink>

          <NavLink
            to="/admin/products/delete"
            className={({ isActive }) =>
              `px-4 py-2 rounded ${
                isActive ? "bg-red-400 text-black" : "hover:bg-gray-700"
              }`
            }
          >
            🗑 Delete Product
          </NavLink>

          {/* Add Variant */}
          <NavLink
            to="/admin/products/add-variant"
            className={({ isActive }) =>
              `px-4 py-2 rounded ${
                isActive ? "bg-yellow-300 text-black" : "hover:bg-gray-700"
              }`
            }
          >
            ➕ Add Variant
          </NavLink>

          <NavLink
            to="/admin/products/delete-variant"
            className={({ isActive }) =>
              `px-4 py-2 rounded ${
                isActive ? "bg-red-400 text-black" : "hover:bg-gray-700"
              }`
            }
          >
            🗑 Delete Variants
          </NavLink>

          <NavLink
            to="/admin/categories"
            className={({ isActive }) =>
              `px-4 py-2 rounded ${
                isActive ? "bg-yellow-500 text-black" : "hover:bg-gray-700"
              }`
            }
          >
            Categories
          </NavLink>

          <NavLink
            to="/admin/upload-images"
            className={({ isActive }) =>
              `px-4 py-2 rounded ${
                isActive ? "bg-yellow-500 text-black" : "hover:bg-gray-700"
              }`
            }
          >
            Upload Images
          </NavLink>
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
