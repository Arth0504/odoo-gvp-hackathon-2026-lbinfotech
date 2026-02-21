const Driver = require("../models/Driver");

// Create Driver
exports.createDriver = async (req, res) => {
  try {
    const driver = await Driver.create(req.body);
    res.status(201).json(driver);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get All Drivers
exports.getDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find();
    res.json(drivers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Driver
exports.updateDriver = async (req, res) => {
  try {
    const driver = await Driver.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(driver);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete Driver
exports.deleteDriver = async (req, res) => {
  try {
    await Driver.findByIdAndDelete(req.params.id);
    res.json({ message: "Driver deleted" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
const Trip = require("../models/Trip");

exports.getDriverPerformance = async (req, res) => {
  try {
    const driverId = req.params.id;

    const totalTrips = await Trip.countDocuments({ driver: driverId });
    const completedTrips = await Trip.countDocuments({
      driver: driverId,
      status: "Completed"
    });
    const cancelledTrips = await Trip.countDocuments({
      driver: driverId,
      status: "Cancelled"
    });

    const completionRate = totalTrips > 0
      ? ((completedTrips / totalTrips) * 100).toFixed(0)
      : 100;

    // Persist safety score
    const driver = await Driver.findById(driverId);
    if (driver) {
      driver.safetyScore = Number(completionRate);
      await driver.save();
    }

    res.json({
      totalTrips,
      completedTrips,
      cancelledTrips,
      completionRate: `${completionRate}%`,
      safetyScore: Number(completionRate)
    });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};