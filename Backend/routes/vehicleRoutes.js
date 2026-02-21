const express = require("express");
const router = express.Router();
const {
  createVehicle,
  getVehicles,
  updateVehicle,
  deleteVehicle
} = require("../controllers/vehicleController");

const { protect, authorize } = require("../middleware/authMiddleware");

// Only Manager can create
router.post("/", protect, authorize("manager"), createVehicle);

// All logged-in users can view
router.get("/", protect, getVehicles);

// Only Manager update/delete
router.put("/:id", protect, authorize("manager"), updateVehicle);
router.delete("/:id", protect, authorize("manager"), deleteVehicle);

module.exports = router;