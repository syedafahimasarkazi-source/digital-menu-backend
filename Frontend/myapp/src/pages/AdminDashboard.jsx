import { useEffect, useState, useRef } from "react";
import API from "../api/axios";
import socket from "../socket/socket";

export default function AdminDashboard() {
  const [menu, setMenu] = useState([]);
  const [filteredMenu, setFilteredMenu] = useState([]);
  const [preview, setPreview] = useState(null);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  const fileInputRef = useRef();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: null,
  });

  // ================= FETCH =================
  const fetchMenu = async () => {
    const res = await API.get("/menu");
    const data = res.data.data || res.data;
    const list = Array.isArray(data) ? data : [];
    setMenu(list);
    setFilteredMenu(list);
  };

  const fetchCategories = async () => {
    const res = await API.get("/categories");
    const data = res.data.data || res.data;
    setCategories(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    fetchMenu();
    fetchCategories();

    socket.on("menuUpdated", fetchMenu);
    return () => socket.off("menuUpdated", fetchMenu);
  }, []);

  // ================= SEARCH =================
  useEffect(() => {
    const filtered = menu.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredMenu(filtered);
  }, [search, menu]);

  // ================= CREATE MENU =================
  const handleCreate = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.keys(form).forEach((key) => {
      if (form[key]) data.append(key, form[key]);
    });

    await API.post("/menu", data);

    setForm({
      name: "",
      description: "",
      price: "",
      category: "",
      image: null,
    });

    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ================= CATEGORY =================
  const createCategory = async () => {
    if (!newCategory) return;

    await API.post("/categories", { name: newCategory });
    setNewCategory("");
    fetchCategories();
  };

  const deleteCategory = async (id) => {
    await API.delete(`/categories/${id}`);
    fetchCategories();
  };

  // ================= MENU ACTIONS =================
  const toggleAvailability = async (id) => {
    await API.patch(`/menu/${id}/toggle`);
  };

  const deleteItem = async (id) => {
    await API.delete(`/menu/${id}`);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* SIDEBAR */}
      <div className={`fixed md:static z-50 bg-white w-64 h-full shadow ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0 transition`}>
        <div className="p-5 text-xl font-bold border-b">
          🍽 Admin Panel
        </div>
      </div>

      {/* MAIN */}
      <div className="flex-1 p-4 md:p-6 space-y-5">

        {/* TOP */}
        <div className="flex justify-between items-center">
          <h1 className="text-lg font-bold">Dashboard</h1>
        </div>

        {/* SEARCH */}
        <input
          type="text"
          placeholder="🔍 Search menu..."
          className="w-full border p-2 rounded focus:ring-2 focus:ring-orange-400"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* ================= COMPACT TOP SECTION ================= */}
        <div className="grid md:grid-cols-2 gap-4">

          {/* CATEGORY */}
          <div className="bg-white p-4 rounded-xl shadow">
            <h2 className="text-sm font-semibold mb-3">Categories</h2>

            <div className="flex gap-2 mb-3">
              <input
                type="text"
                placeholder="Add category"
                className="border p-1.5 text-sm rounded w-full"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />

              <button
                onClick={createCategory}
                className="bg-green-500 text-white px-3 text-sm rounded"
              >
                +
              </button>
            </div>

            <div className="flex flex-wrap gap-1">
              {categories.map((cat) => (
                <div
                  key={cat._id}
                  className="flex items-center gap-1 bg-green-50 px-2 py-0.5 rounded-full text-xs"
                >
                  {cat.name}
                  <button onClick={() => deleteCategory(cat._id)}>
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* ADD ITEM */}
          <div className="bg-white p-4 rounded-xl shadow">
            <h2 className="text-sm font-semibold mb-3">Add Item</h2>

            <form className="grid grid-cols-2 gap-2" onSubmit={handleCreate}>

              <input
                placeholder="Name"
                className="border p-1.5 text-sm rounded"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />

              <input
                placeholder="Price"
                className="border p-1.5 text-sm rounded"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />

              <select
                className="border p-1.5 text-sm rounded col-span-2"
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value })
                }
              >
                <option value="">Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>

              <input
                placeholder="Description"
                className="border p-1.5 text-sm rounded col-span-2"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />

              <input
                ref={fileInputRef}
                type="file"
                className="border p-1 text-sm rounded col-span-2"
                onChange={(e) => {
                  const file = e.target.files[0];
                  setForm({ ...form, image: file });
                  if (file) setPreview(URL.createObjectURL(file));
                }}
              />

              {preview && (
                <img src={preview} className="h-12 rounded col-span-2" />
              )}

              <button
                type="submit"
                className="col-span-2 bg-blue-500 text-white py-1.5 text-sm rounded"
              >
                Add
              </button>
            </form>
          </div>

        </div>

        {/* ================= MENU LIST ================= */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="text-sm font-semibold mb-3">Menu Items</h2>

          <div className="space-y-2">
            {filteredMenu.map((item) => (
              <div
                key={item._id}
                className="flex justify-between items-center bg-gray-50 p-2 rounded"
              >
                <div className="flex gap-2 items-center">
                  <img
                    src={item.image || "/no-image.png"}
                    className="w-12 h-12 rounded object-cover"
                  />
                  <div>
                    <p className="text-sm font-semibold">{item.name}</p>
                    <p className="text-xs text-gray-500">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-orange-500 font-bold text-sm">
                    ₹{item.price}
                  </span>

                  <button
                    onClick={() => toggleAvailability(item._id)}
                    className="text-xs bg-green-100 px-2 py-1 rounded"
                  >
                    {item.isAvailable ? "On" : "Off"}
                  </button>

                  <button
                    onClick={() => deleteItem(item._id)}
                    className="text-red-500 text-sm"
                  >
                    🗑
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}