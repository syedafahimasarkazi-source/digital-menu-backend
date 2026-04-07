// src/pages/CustomerMenu.jsx
import { useEffect, useState } from "react";
import API from "../api/axios";
import socket from "../socket/socket";

export default function CustomerMenu() {
  const [menu, setMenu] = useState([]);

  const fetchMenu = async () => {
    const res = await API.get("/menu");
    setMenu(res.data.filter((item) => item.available));
  };

  useEffect(() => {
    fetchMenu();

    socket.on("menuUpdated", fetchMenu);

    return () => socket.off("menuUpdated");
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Live Menu</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {menu.map((item) => (
          <div key={item._id} className="bg-white rounded shadow p-3">
            <img src={item.image} className="h-40 w-full object-cover rounded" />
            <h2 className="font-bold mt-2">{item.name}</h2>
            <p className="text-green-600 font-semibold">₹{item.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}