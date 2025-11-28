import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.isAdmin) {
      navigate("/");
    }
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <p>Website analytics will appear here.</p>
    </div>
  );
}
