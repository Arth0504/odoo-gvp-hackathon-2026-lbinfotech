const express = require("express");
const router = express.Router();

const { addFuelLog } = require("../controllers/fuelController");
const { protect, authorize } = require("../middleware/authMiddleware");

// Manager & Finance allowed
router.post("/", protect, authorize("manager", "finance"), addFuelLog);

module.exports = router;