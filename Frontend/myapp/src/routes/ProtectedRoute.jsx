// src/routes/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, role }) {
  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch (err) {
    console.error("Invalid user in localStorage");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }

  //  Not logged in
  if (!user) {
    return <Navigate to="/" replace />;
  }

  //  Role mismatch
  if (role && user.role !== role) {
    return <Navigate to="/menu" replace />;
  }

  // ✅ Allowed
  return children;
}