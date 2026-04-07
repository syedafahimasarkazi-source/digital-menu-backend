const Category = require("./models/Category");

const createCategory = async (data) => {
  return await Category.create(data);
};

const getAllCategories = async () => {
  return await Category.find().sort({ createdAt: -1 });
};

const getCategoryById = async (id) => {
  return await Category.findById(id);
};

const updateCategory = async (id, data) => {
  return await Category.findByIdAndUpdate(id, data, { new: true, runValidators: true });
};

const deleteCategory = async (id) => {
  return await Category.findByIdAndDelete(id);
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};