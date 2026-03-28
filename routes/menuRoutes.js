const express = require("express");
const router = express.Router();

const menuController = require("../controllers/menuController");
const {authMiddleware} = require("../middlewares/authMiddleware");
const {roleMiddleware} = require("../middlewares/roleMiddleware");

// protect all routes
router.use(authMiddleware);

// admin only
router.post("/", roleMiddleware("admin"), menuController.createMenuItem);
router.put("/:id", roleMiddleware("admin"), menuController.updateMenuItem);
router.delete("/:id", roleMiddleware("admin"), menuController.deleteMenuItem);

// admin + manager
router.get("/", roleMiddleware("admin", "manager"), menuController.getMenuItems);
router.get("/:id", roleMiddleware("admin", "manager"), menuController.getMenuItemById);

module.exports = router;