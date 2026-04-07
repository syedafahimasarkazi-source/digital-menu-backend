// controllers/categoryController.js

const Category = require("../models/Category");
const asyncHandler = require("../utils/asyncHandler");
const {
  createCategorySchema,
  updateCategorySchema,
} = require("../validators/categoryValidator");

// ==========================
// CREATE CATEGORY
// ==========================
exports.createCategory = asyncHandler(async (req, res) => {
  const { error, value } = createCategorySchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }

  // 🔥 Only name required
  const { name } = value;

  const categoryExists = await Category.findOne({
    name: name.trim().toLowerCase(),
  });

  if (categoryExists) {
    return res.status(400).json({
      success: false,
      message: "Category already exists",
    });
  }

  const category = await Category.create({
    name: name.trim(),
    createdBy: req.user?._id, // safe optional
  });

  res.status(201).json({
    success: true,
    data: category,
    message: "Category created successfully",
  });
});

// ==========================
// GET ALL CATEGORIES
// ==========================
exports.getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ isActive: true })
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: categories.length,
    data: categories,
  });
});

// ==========================
// GET CATEGORY BY ID
// ==========================
exports.getCategoryById = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category || !category.isActive) {
    return res.status(404).json({
      success: false,
      message: "Category not found",
    });
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

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }

  if (value.name) {
    value.name = value.name.trim();
  }

  const category = await Category.findByIdAndUpdate(
    req.params.id,
    value,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!category || !category.isActive) {
    return res.status(404).json({
      success: false,
      message: "Category not found",
    });
  }

  res.status(200).json({
    success: true,
    data: category,
    message: "Category updated successfully",
  });
});

// ==========================
// DELETE CATEGORY (SOFT DELETE)
// ==========================
exports.deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category || !category.isActive) {
    return res.status(404).json({
      success: false,
      message: "Category not found or already deleted",
    });
  }

  category.isActive = false;
  await category.save();

  res.status(200).json({
    success: true,
    message: "Category deleted successfully",
  });
});