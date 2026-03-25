// src/controllers/categoryController.js
const Category = require("../models/Category");
const asyncHandler = require("../utils/asyncHandler");
const { createCategorySchema, updateCategorySchema } = require("../validators/categoryValidator");

// ==========================
// CREATE CATEGORY
// ==========================
exports.createCategory = asyncHandler(async (req, res) => {
  const { error, value } = createCategorySchema.validate(req.body);
  if (error) return res.status(400).json({ success: false, message: error.details[0].message });

  const categoryExists = await Category.findOne({ name: value.name });
  if (categoryExists) {
    return res.status(400).json({ success: false, message: "Category already exists" });
  }

  const category = await Category.create({
    ...value,
    createdBy: req.user._id, // track which user created
  });

  res.status(201).json({
    success: true,
    data: category,
    message: "Category created successfully",
  });
});

// ==========================
// GET ALL CATEGORIES (with pagination)
// ==========================
exports.getCategories = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const categories = await Category.find({ isActive: true })
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const total = await Category.countDocuments({ isActive: true });

  res.status(200).json({
    success: true,
    count: categories.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    data: categories,
  });
});

// ==========================
// GET SINGLE CATEGORY
// ==========================
exports.getCategoryById = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category || !category.isActive) {
    return res.status(404).json({ success: false, message: "Category not found" });
  }

  res.status(200).json({
    success: true,
    data: category,
  });
});

// ==========================
// UPDATE CATEGORY
// ==========================
exports.updateCategory = asyncHandler(async (req, res) => {
  const { error, value } = updateCategorySchema.validate(req.body);
  if (error) return res.status(400).json({ success: false, message: error.details[0].message });

  const category = await Category.findByIdAndUpdate(req.params.id, value, {
    new: true,
    runValidators: true,
  });

  if (!category || !category.isActive) {
    return res.status(404).json({ success: false, message: "Category not found" });
  }

  res.status(200).json({
    success: true,
    data: category,
    message: "Category updated successfully",
  });
});

// ==========================
// DELETE CATEGORY (Soft Delete)
// ==========================
exports.deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category || !category.isActive) {
    return res.status(404).json({ success: false, message: "Category not found or already deactivated" });
  }

  category.isActive = false;
  await category.save();

  res.status(200).json({
    success: true,
    message: "Category deactivated successfully",
  });
});