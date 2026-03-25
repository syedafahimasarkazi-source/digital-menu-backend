const MenuItem = require("../models/MenuItem");
const asyncHandler = require("../utils/asyncHandler");
const {
  createMenuSchema,
  updateMenuSchema,
} = require("../validators/menuValidator");

// CREATE MENU ITEM
exports.createMenuItem = asyncHandler(async (req, res) => {
  const { error, value } = createMenuSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const item = await MenuItem.create({
    ...value,
    createdBy: req.user._id,
  });

  res.status(201).json({ success: true, data: item });
});

// GET ALL MENU ITEMS
exports.getMenuItems = asyncHandler(async (req, res) => {
  const items = await MenuItem.find()
    .populate("category", "name")
    .sort({ createdAt: -1 });

  res.json({ success: true, data: items });
});

// GET SINGLE ITEM
exports.getMenuItemById = asyncHandler(async (req, res) => {
  const item = await MenuItem.findById(req.params.id).populate("category");

  if (!item) {
    return res.status(404).json({ message: "Item not found" });
  }

  res.json({ success: true, data: item });
});

// UPDATE ITEM
exports.updateMenuItem = asyncHandler(async (req, res) => {
  const { error, value } = updateMenuSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const item = await MenuItem.findByIdAndUpdate(req.params.id, value, {
    new: true,
  });

  res.json({ success: true, data: item });
});

// DELETE ITEM
exports.deleteMenuItem = asyncHandler(async (req, res) => {
  await MenuItem.findByIdAndDelete(req.params.id);

  res.json({ success: true, message: "Item deleted" });
});