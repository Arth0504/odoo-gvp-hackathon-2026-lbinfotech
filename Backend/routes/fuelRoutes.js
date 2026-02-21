const express = require("express");
const router = express.Router();

const { addFuelLog, getFuelLogs } = require("../controllers/fuelController");
const { protect, authorize } = require("../middleware/authMiddleware");

// Routes
router.get("/", protect, getFuelLogs);
router.post("/", protect, authorize("finance"), addFuelLog);

module.exports = router;