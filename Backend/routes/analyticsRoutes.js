const express = require("express");
const router = express.Router();

const { getVehicleAnalytics, getFleetFinancials } = require("../controllers/analyticsController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.get("/fleet", protect, authorize("finance", "manager"), getFleetFinancials);
router.get("/:id", protect, getVehicleAnalytics);

module.exports = router;