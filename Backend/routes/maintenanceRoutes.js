const express = require("express");
const router = express.Router();

const { addMaintenance, completeMaintenance, getMaintenanceLogs } = require("../controllers/maintenanceController");
const { protect, authorize } = require("../middleware/authMiddleware");

// Get Logs
router.get("/", protect, authorize("manager"), getMaintenanceLogs);

// Add Maintenance
router.post("/", protect, authorize("manager"), addMaintenance);

// Complete Maintenance
router.put("/:id/complete", protect, authorize("manager"), completeMaintenance);

module.exports = router;