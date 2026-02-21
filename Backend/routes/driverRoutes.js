const express = require("express");
const router = express.Router();

const {
  createDriver,
  getDrivers,
  updateDriver,
  deleteDriver,
  getDriverPerformance
} = require("../controllers/driverController");

const { protect, authorize } = require("../middleware/authMiddleware");

// Manager & Safety can create
router.post("/", protect, authorize("manager", "safety"), createDriver);

// All logged-in users can view
router.get("/", protect, getDrivers);

// Driver Performance
router.get("/:id/performance", protect, getDriverPerformance);

// Only Manager update/delete
router.put("/:id", protect, authorize("manager"), updateDriver);
router.delete("/:id", protect, authorize("manager"), deleteDriver);

module.exports = router;