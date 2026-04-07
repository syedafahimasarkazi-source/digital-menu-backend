import { useState, useContext } from "react";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", form);

      console.log("LOGIN RESPONSE:", res.data); // ✅ debug

      // ✅ handle both response types
      const data = res.data.data || res.data;

      login(data); // ✅ correct

      // ✅ safe role check
      if (data.user?.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/menu");
      }

    } catch (err) {
      console.error("LOGIN ERROR:", err.response?.data || err.message);
      alert("Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-lg w-80"
      >
        <h2 className="text-xl mb-4 font-bold text-center">Login</h2>

        <input
          className="w-full mb-3 p-2 border rounded"
          placeholder="Email"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          className="w-full mb-3 p-2 border rounded"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <button className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700">
          Login
        </button>
      </form>
    </div>
  );
}