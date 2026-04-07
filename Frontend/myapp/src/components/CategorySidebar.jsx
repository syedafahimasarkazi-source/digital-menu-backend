const CategorySidebar = ({ categories, active, setActive }) => {
  return (
    <div className="w-1/4 bg-white shadow-xl p-5">
      <h2 className="text-2xl font-bold text-orange-500 mb-6">
        Menu
      </h2>

      {categories.map((cat) => (
        <div
          key={cat._id}
          onClick={() => setActive(cat._id)}
          className={`p-3 mb-3 rounded-xl cursor-pointer transition ${
            active === cat._id
              ? "bg-orange-500 text-white shadow-lg"
              : "bg-gray-100 hover:bg-orange-100"
          }`}
        >
          {cat.name}
        </div>
      ))}
    </div>
  );
};

export default CategorySidebar;