import AdminLayout from "./AdminLayout";

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-3">Admin Dashboard</h1>
      <p className="text-gray-600">Manage products, categories & images.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        
        <div className="bg-white p-6 shadow rounded">
          <h2 className="text-xl font-semibold">Products</h2>
          <p className="text-gray-500 mt-2">Create, edit & delete products.</p>
        </div>

        <div className="bg-white p-6 shadow rounded">
          <h2 className="text-xl font-semibold">Categories</h2>
          <p className="text-gray-500 mt-2">Manage product categories.</p>
        </div>

        <div className="bg-white p-6 shadow rounded">
          <h2 className="text-xl font-semibold">Images</h2>
          <p className="text-gray-500 mt-2">Upload product/variant images.</p>
        </div>

      </div>
    </AdminLayout>
  );
}
