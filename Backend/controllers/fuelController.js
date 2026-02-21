const FuelLog = require("../models/FuelLog");
const Vehicle = require("../models/Vehicle");

// Add Fuel Log
exports.addFuelLog = async (req, res) => {
  try {
    const { vehicle, liters, cost } = req.body;

    const selectedVehicle = await Vehicle.findById(vehicle);
    if (!selectedVehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    const fuelLog = await FuelLog.create({
      vehicle,
      liters,
      cost
    });

    res.status(201).json(fuelLog);

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get All Fuel Logs
exports.getFuelLogs = async (req, res) => {
  try {
    const logs = await FuelLog.find().populate("vehicle", "name licensePlate").sort({ date: -1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};