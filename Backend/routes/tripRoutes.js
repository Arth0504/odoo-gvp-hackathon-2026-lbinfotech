const express = require("express");
const router = express.Router();

const { createTrip, getTrips, dispatchTrip, completeTrip, cancelTrip } = require("../controllers/tripController");
const { protect, authorize } = require("../middleware/authMiddleware");

// View Trips
router.get("/", protect, getTrips);

// Create Trip
router.post("/", protect, authorize("dispatcher"), createTrip);

// Dispatch Trip
router.put("/:id/dispatch", protect, authorize("dispatcher"), dispatchTrip);

// Complete Trip
router.put("/:id/complete", protect, authorize("dispatcher"), completeTrip);

// Cancel Trip
router.put("/:id/cancel", protect, authorize("dispatcher"), cancelTrip);

module.exports = router;