export default function MenuCard({ item, onToggle, onDelete }) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:scale-105 transition">
      <img
        src={item.image}
        alt={item.name}
        className="h-40 w-full object-cover"
      />

      <div className="p-3">
        <h2 className="font-semibold text-lg">{item.name}</h2>

        <div className="flex justify-between items-center mt-2">
          <span className="bg-yellow-300 px-2 py-1 rounded-full font-bold">
            ₹{item.price}
          </span>

          {/* UPDATED STATUS */}
          <span
            className={`text-sm font-semibold ${
              item.isAvailable ? "text-green-600" : "text-red-500"
            }`}
          >
            {item.isAvailable ? "Available" : "Hidden"}
          </span>
        </div>

        <div className="flex gap-2 mt-3">
          {/*  UPDATED TOGGLE BUTTON */}
          <button
            onClick={() => onToggle(item._id)}
            className={`px-3 py-1 rounded text-white ${
              item.isAvailable ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
            }`}
          >
            {item.isAvailable ? "Hide Item" : "Show Item"}
          </button>

          {/*  DELETE */}
          <button
            onClick={() => onDelete(item._id)}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}