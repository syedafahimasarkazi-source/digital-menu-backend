const express = require("express");
const router = express.Router();

const {
  createMenuItem,
  getMenuItems,
  getMenuItemById,
  updateMenuItem,
  deleteMenuItem,
  toggleAvailability,
} = require("../controllers/menuController");

const { authMiddleware } = require("../middlewares/authMiddleware");
const { roleMiddleware } = require("../middlewares/roleMiddleware");
const upload = require("../middlewares/uploadMiddleware");

// 🔒 Protect all routes
router.use(authMiddleware);

// CREATE
router.post(
  "/",
  upload.single("image"),
  roleMiddleware("admin"),
  createMenuItem
);
//toggle
router.patch(
  "/:id/toggle",
  authMiddleware,                 // ✅ ADD THIS
  roleMiddleware("admin", "manager"),
  toggleAvailability
);

// UPDATE
router.put(
  "/:id",
  upload.single("image"),
  roleMiddleware("admin"),
  updateMenuItem
);

// DELETE
router.delete(
  "/:id",
  roleMiddleware("admin"),
  deleteMenuItem
);

// GET ALL
router.get(
  "/",
  roleMiddleware("admin", "manager"),
  getMenuItems
);

// GET ONE
router.get(
  "/:id",
  roleMiddleware("admin", "manager"),
  getMenuItemById
);

module.exports = router;