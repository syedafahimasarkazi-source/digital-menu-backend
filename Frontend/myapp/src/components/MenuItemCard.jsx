const MenuItemCard = ({ item }) => {
  return (
    <div className="bg-white rounded-xl shadow hover:shadow-lg transition p-4">
      <img
        src={item.image}
        alt={item.name}
        className="h-40 w-full object-cover rounded-lg"
      />

      <div className="mt-3">
        <h3 className="text-lg font-semibold">{item.name}</h3>

        <p className="text-gray-500 text-sm">
          {item.description}
        </p>

        <div className="flex justify-between items-center mt-2">
          <span className="text-orange-500 font-bold text-lg">
            ₹{item.price}
          </span>

          <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">
            Available
          </span>
        </div>
      </div>
    </div>
  );
};

export default MenuItemCard;