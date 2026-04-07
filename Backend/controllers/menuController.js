const MenuItem = require("../models/MenuItem");
const Category = require("../models/Category");
const cloudinary = require("../config/cloudinary");

const {
  createMenuSchema,
  updateMenuSchema,
} = require("../validators/menuValidator");

//CREATE MENU ITEM
exports.createMenuItem = async (req, res) => {
  try {
    const { error, value } = createMenuSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }

    //Check category exists
    const category = await Category.findById(value.category);
    if (!category) {
      return res.status(400).json({
        message: "Category not found",
      });
    }

    // Image
    const image = req.file ? req.file.path : "";

    const item = await MenuItem.create({
  ...value,
  image,
  isAvailable: value.isAvailable ?? true,
  createdBy: req.user._id,
});

//  REAL-TIME EVENT
global.io.emit("menuUpdated", {
  action: "CREATE",
  data: item,
});

    res.status(201).json({
      success: true,
      data: item,
    });
  } catch (err) {
    console.error("CREATE ERROR:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

//  GET ALL MENU ITEMS
exports.getMenuItems = async (req, res) => {
  try {
    let filter = {};

    // ✅ Show only available items for normal users
    if (!req.user || !["admin", "manager"].includes(req.user.role)) {
      filter.isAvailable = true;
    }

    const items = await MenuItem.find(filter)
      .populate("category", "name")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (err) {
    console.error("GET ALL ERROR:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// GET SINGLE MENU ITEM
exports.getMenuItemById = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id).populate("category");

    if (!item) {
      return res.status(404).json({
        message: "Item not found",
      });
    }

    res.json({
      success: true,
      data: item,
    });
  } catch (err) {
    console.error("GET ONE ERROR:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
//UPDATE 
exports.updateMenuItem = async (req, res) => {
  try {
    const { error, value } = updateMenuSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }

    let item = await MenuItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        message: "Item not found",
      });
    }

    // ✅ If new image uploaded
    if (req.file) {
      // Delete old image
      if (item.image) {
        try {
          const parts = item.image.split("/");
          const fileName = parts[parts.length - 1];
          const publicId = fileName.split(".")[0];

          await cloudinary.uploader.destroy(`menu-items/${publicId}`);
        } catch (err) {
          console.log("Cloudinary delete error:", err.message);
        }
      }

      value.image = req.file.path;
    }

    // Update AFTER processing image
    item = await MenuItem.findByIdAndUpdate(req.params.id, value, {
      new: true,
    });

    //  REAL-TIME EVENT (AFTER FINAL UPDATE)
    global.io.emit("menuUpdated", {
      action: "UPDATE",
      data: item,
    });

    res.json({
      success: true,
      data: item,
    });
  } catch (err) {
    console.error("UPDATE ERROR:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// DELETE MENU ITEM
exports.deleteMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        message: "Item not found",
      });
    }

    // 🔥 Delete image
    if (item.image) {
      try {
        const parts = item.image.split("/");
        const fileName = parts[parts.length - 1];
        const publicId = fileName.split(".")[0];

        await cloudinary.uploader.destroy(`menu-items/${publicId}`);
      } catch (err) {
        console.log("Cloudinary delete error:", err.message);
      }
    }

await item.deleteOne();

// 🔥 REAL-TIME EVENT
global.io.emit("menuUpdated", {
  action: "DELETE",
  data: { id: req.params.id },
});
    res.json({
      success: true,
      message: "Item deleted",
    });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// TOGGLE AVAILABILITY (NEW)
exports.toggleAvailability = async (req, res) => {
  try {
        console.log("REQ USER:", req.user); 

    const item = await MenuItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        message: "Item not found",
      });
    }

    item.isAvailable = !item.isAvailable;
await item.save();

// 🔥 REAL-TIME EVENT
global.io.emit("menuUpdated", {
  action: "TOGGLE_AVAILABILITY",
  data: item,
});;

    res.json({
      success: true,
      message: "Availability updated",
      data: item,
    });
  } catch (err) {
    console.error("TOGGLE ERROR:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};