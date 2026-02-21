const express = require("express");
const router = express.Router();

const { addMaintenance, completeMaintenance } = require("../controllers/maintenanceController");
const { protect, authorize } = require("../middleware/authMiddleware");

// Add Maintenance
router.post("/", protect, authorize("manager"), addMaintenance);

// Complete Maintenance
router.put("/:id/complete", protect, authorize("manager"), completeMaintenance);

module.exports = router;