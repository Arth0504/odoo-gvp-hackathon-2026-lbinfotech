const express = require("express");
const router = express.Router();

const { getVehicleAnalytics } = require("../controllers/analyticsController");
const { protect } = require("../middleware/authMiddleware");

router.get("/:id", protect, getVehicleAnalytics);

module.exports = router;