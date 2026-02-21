const Maintenance = require("../models/Maintenance");
const Vehicle = require("../models/Vehicle");

// Get All Maintenance Logs (Manager only)
exports.getMaintenanceLogs = async (req, res) => {
  try {
    const logs = await Maintenance.find().populate("vehicle", "registrationNumber name status").sort("-createdAt");
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add Maintenance
exports.addMaintenance = async (req, res) => {
  try {
    const { vehicle, serviceType, cost, notes } = req.body;

    const selectedVehicle = await Vehicle.findById(vehicle);
    if (!selectedVehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    if (selectedVehicle.status === "OnTrip") {
      return res.status(400).json({ message: "Cannot service a vehicle that is currently on a trip" });
    }

    const maintenance = await Maintenance.create({
      vehicle,
      serviceType,
      cost,
      notes,
      status: "Open" // Ensure status is set
    });

    // 🔄 Auto Change Status
    selectedVehicle.status = "InShop";
    await selectedVehicle.save();

    res.status(201).json(maintenance);

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Complete Maintenance
exports.completeMaintenance = async (req, res) => {
  try {
    const maintenance = await Maintenance.findById(req.params.id);

    if (!maintenance) {
      return res.status(404).json({ message: "Maintenance record not found" });
    }

    const vehicle = await Vehicle.findById(maintenance.vehicle);

    if (vehicle) {
      vehicle.status = "Available";
      await vehicle.save();
    }

    maintenance.status = "Closed";
    await maintenance.save();

    res.json({
      message: "Maintenance completed successfully",
      vehicle
    });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};