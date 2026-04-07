// src/models/Category.js
const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
      trim: true,
      maxlength: [50, "Category name must be less than 50 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [250, "Description must be less than 250 characters"],
    },
    isActive: {
      type: Boolean,
      default: true, // used for soft delete
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // reference to User model
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);