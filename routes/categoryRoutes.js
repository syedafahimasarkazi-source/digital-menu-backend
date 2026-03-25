// src/routes/categoryRoutes.js

const express = require("express");
const router = express.Router();

const categoryController = require("../controllers/categoryController");
const { authMiddleware } = require("../middlewares/authMiddleware");
const { roleMiddleware } = require("../middlewares/roleMiddleware");

// ==========================
// All routes require authentication
// ==========================
router.use(authMiddleware);

// ==========================
// Admin only
// ==========================
router.post("/", roleMiddleware("admin"), categoryController.createCategory);
router.put("/:id", roleMiddleware("admin"), categoryController.updateCategory);
router.delete("/:id", roleMiddleware("admin"), categoryController.deleteCategory);

// ==========================
// Admin + Manager
// ==========================
router.get("/", roleMiddleware("admin", "manager"), categoryController.getCategories);
router.get("/:id", roleMiddleware("admin", "manager"), categoryController.getCategoryById);

module.exports = router;