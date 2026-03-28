const MenuItem = require("../models/MenuItem");
const Category = require("../models/Category");
const cloudinary = require("../config/cloudinary");

const {
  createMenuSchema,
  updateMenuSchema,
} = require("../validators/menuValidator");

// CREATE
exports.createMenuItem = async (req, res) => {
  try {
    const { error, value } = createMenuSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // ✅ Check category exists
    const category = await Category.findById(value.category);
    if (!category) {
      return res.status(400).json({ message: "Category not found" });
    }

    // ✅ Get uploaded image URL from Cloudinary
    const image = req.file ? req.file.path : "";

    const item = await MenuItem.create({
      ...value,
      image,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      data: item,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// GET ALL
exports.getMenuItems = async (req, res) => {
  try {
    const items = await MenuItem.find()
      .populate("category", "name")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: items,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// GET ONE
exports.getMenuItemById = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id).populate("category");

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json({
      success: true,
      data: item,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// UPDATE
exports.updateMenuItem = async (req, res) => {
  try {
    const { error, value } = updateMenuSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    let item = await MenuItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // ✅ If new image uploaded
    if (req.file) {
      // 🔥 Delete old image from Cloudinary (if exists)
      if (item.image) {
        try {
          const publicId = item.image.split("/").pop().split(".")[0];
          await cloudinary.uploader.destroy(`menu-items/${publicId}`);
        } catch (err) {
          console.log("Cloudinary delete error:", err.message);
        }
      }

      // ✅ Set new image URL
      value.image = req.file.path;
    }

    item = await MenuItem.findByIdAndUpdate(req.params.id, value, {
      new: true,
    });

    res.json({
      success: true,
      data: item,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// DELETE
exports.deleteMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // 🔥 Delete image from Cloudinary
    if (item.image) {
      try {
        const publicId = item.image.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`menu-items/${publicId}`);
      } catch (err) {
        console.log("Cloudinary delete error:", err.message);
      }
    }

    await item.deleteOne();

    res.json({
      success: true,
      message: "Item deleted",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};