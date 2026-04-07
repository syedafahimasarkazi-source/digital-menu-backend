// App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import CustomerMenu from "./pages/CustomerMenu";
import ProtectedRoute from "./routes/ProtectedRoute";
import LiveMenu from "./pages/LiveMenu";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/menu" element={<LiveMenu />} />
        <Route path="/menu" element={<CustomerMenu />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;