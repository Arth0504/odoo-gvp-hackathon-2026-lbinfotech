const express = require("express");
const router = express.Router();

const { createTrip, completeTrip, cancelTrip } = require("../controllers/tripController");
const { protect, authorize } = require("../middleware/authMiddleware");

// Create Trip
router.post("/", protect, authorize("dispatcher", "manager"), createTrip);

// Complete Trip
router.put("/:id/complete", protect, authorize("dispatcher", "manager"), completeTrip);

// Cancel Trip
router.put("/:id/cancel", protect, authorize("dispatcher", "manager"), cancelTrip);

module.exports = router;