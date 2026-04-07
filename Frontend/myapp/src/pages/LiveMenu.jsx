import { useEffect, useState } from "react";
import API from "../api/axios";

const LiveMenu = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    const res = await API.get("/menu");
    setItems(res.data.data);
  };

  // ✅ GROUP BY CATEGORY
  const groupByCategory = (items) => {
    return items.reduce((acc, item) => {
      const cat = item.category?.name || "Menu";

      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(item);

      return acc;
    }, {});
  };

  const grouped = groupByCategory(items);
  const categories = Object.entries(grouped);

  return (
    <div
      className="relative min-h-screen bg-cover bg-center text-white px-10 py-6"
      style={{ backgroundImage: "url('/bg-texture.jpg')" }}
    >
      {/* 🍔 FLOATING BURGER IMAGES */}
      <div className="absolute top-0 left-0 w-full pointer-events-none">

  {/* LEFT IMAGE */}
  <img
    src="/burger1.png"
    className="absolute left-5 top-6 w-52  h-52 glow-img"
    style={{
      animation: "float1 6s ease-in-out infinite"
    }}
  />
 

  {/* RIGHT IMAGE */}
  <img
    src="/burger2.png"
    className="absolute right-5 top-6 w-52 h-52 glow-img"
    style={{
      animation: "float3 5s ease-in-out infinite"
    }}
  />

  {/* 🔥 INLINE KEYFRAMES */}
  <style>
    {`
      @keyframes float1 {
        0%   { transform: translate(0, 0); }
        50%  { transform: translate(15px, -15px); }
        100% { transform: translate(0, 0); }
      }

      @keyframes float2 {
        0%   { transform: translate(-50%, 0); }
        50%  { transform: translate(-50%, -20px); }
        100% { transform: translate(-50%, 0); }
      }

      @keyframes float3 {
        0%   { transform: translate(0, 0); }
        50%  { transform: translate(-15px, -10px); }
        100% { transform: translate(0, 0); }
      }
    `}
  </style>

</div>

      {/* HEADER */}
      <div className="text-center mb-8">
        <h2 className="text-yellow-400 italic text-xl">
          Remberio Co
        </h2>

        <h1 className="burger-title leading-none">
          <span className="block">BURGER</span>
          <span className="block">MENU</span>
        </h1>

        <p className="text-xs text-yellow-400 tracking-wide mt-2 b-10">
          BITE INTO HAPPINESS AT OUR BURGER PARADISE!
        </p>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-3 gap-10">

        {categories.slice(0, 3).map(([catName, catItems]) => (
          <div key={catName}>

            {/* 🟡 BRUSH TITLE */}
            <div className="brush-title mb-4">
              <img src="/brush.png" />
              <span>{catName.toUpperCase()}</span>
            </div>

            {/* ITEMS */}
            <div className="space-y-4">
              {catItems.map((item) => (
                <div key={item._id}>

                  <div className="flex justify-between font-bold">
                    <span>{item.name}</span>
                    <span className="text-yellow-400">
                      ₹{item.price}
                    </span>
                  </div>

                  <p className="text-sm text-gray-300">
                    {item.description || "Delicious item"}
                  </p>

                  <div className="border-b border-gray-600 mt-1"></div>
                </div>
              ))}
            </div>

          </div>
        ))}

      </div>
    </div>
  );
};

export default LiveMenu;