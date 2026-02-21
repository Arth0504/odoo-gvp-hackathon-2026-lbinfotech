const Vehicle = require("../models/Vehicle");
const Driver = require("../models/Driver");

exports.getDashboardStats = async (req, res) => {
  try {
    const totalVehicles = await Vehicle.countDocuments();
    const activeFleet = await Vehicle.countDocuments({ status: "OnTrip" });
    const inShop = await Vehicle.countDocuments({ status: "InShop" });
    const available = await Vehicle.countDocuments({ status: "Available" });

    const activeDrivers = await Driver.countDocuments({ status: "OnTrip" });

    const utilizationRate = totalVehicles > 0
      ? ((activeFleet / totalVehicles) * 100).toFixed(2)
      : 0;

    res.json({
      totalVehicles,
      activeFleet,
      inShop,
      available,
      activeDrivers,
      utilizationRate: `${utilizationRate}%`
    });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};