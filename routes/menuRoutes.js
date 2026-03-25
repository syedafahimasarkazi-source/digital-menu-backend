const express = require("express");
const router = express.Router();

const menuController = require("../controllers/menuController");
const { authMiddleware } = require("../middlewares/authMiddleware");
const { roleMiddleware } = require("../middlewares/roleMiddleware");

// All routes protected
router.use(authMiddleware);

// Admin only (create/update/delete)
router.post("/", roleMiddleware("admin"), menuController.createMenuItem);
router.put("/:id", roleMiddleware("admin"), menuController.updateMenuItem);
router.delete("/:id", roleMiddleware("admin"), menuController.deleteMenuItem);

// Admin + Manager (read)
router.get("/", roleMiddleware("admin", "manager"), menuController.getMenuItems);
router.get("/:id", roleMiddleware("admin", "manager"), menuController.getMenuItemById);

module.exports = router;