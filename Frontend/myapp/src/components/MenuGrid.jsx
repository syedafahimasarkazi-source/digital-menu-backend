import { motion } from "framer-motion";

const MenuGrid = ({ items, activeCategory }) => {
    const filtered = items.filter(
        (item) => item.category._id === activeCategory
    );

    return (
        <div className="w-3/4 p-6 overflow-y-auto">
            <h1 className="text-3xl font-bold text-orange-600 mb-6">
                Our Specials 🍽️
            </h1>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                {filtered.map((item, index) => (
                    <motion.div
                        key={item._id}
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.05 }}
                        className="bg-white rounded-2xl shadow-lg p-4 relative overflow-hidden"
                    >
                        <motion.img
                            src={item.image}
                            alt={item.name}
                            className="h-40 w-full object-cover rounded-xl float"
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.3 }}
                        />

                        {/* Name */}
                        <h2 className="text-lg font-bold mt-3">
                            {item.name}
                        </h2>

                        {/* Description */}
                        <p className="text-sm text-gray-500">
                            {item.description}
                        </p>

                        {/* Price Tag (Royal Style) */}
                        <div className="absolute top-3 right-3 bg-yellow-400 text-black font-bold px-3 py-1 rounded-full shadow">
                            ₹{item.price}
                        </div>

                        {/* Animated Badge */}
                        <motion.div
                            animate={{ y: [0, -5, 0] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="absolute bottom-3 right-3 bg-green-500 text-white text-xs px-2 py-1 rounded-full"
                        >
                            Fresh
                        </motion.div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default MenuGrid;