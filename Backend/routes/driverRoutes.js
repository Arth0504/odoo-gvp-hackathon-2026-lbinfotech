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

// Safety can create
router.post("/", protect, authorize("safety"), createDriver);

// Safety & Dispatcher can view
router.get("/", protect, authorize("safety", "dispatcher"), getDrivers);

// Driver Performance
router.get("/:id/performance", protect, authorize("safety"), getDriverPerformance);

// Only Safety update/delete
router.put("/:id", protect, authorize("safety"), updateDriver);
router.delete("/:id", protect, authorize("safety"), deleteDriver);

module.exports = router;