const Maintenance = require("../models/Maintenance");
const Vehicle = require("../models/Vehicle");

exports.addMaintenance = async (req, res) => {
  try {
    const { vehicle, serviceType, cost, notes } = req.body;

    const selectedVehicle = await Vehicle.findById(vehicle);
    if (!selectedVehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    const maintenance = await Maintenance.create({
      vehicle,
      serviceType,
      cost,
      notes
    });

    // 🔄 Auto Change Status
    selectedVehicle.status = "InShop";
    await selectedVehicle.save();

    res.status(201).json(maintenance);

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
exports.completeMaintenance = async (req, res) => {
  try {
    const maintenance = await Maintenance.findById(req.params.id);

    if (!maintenance) {
      return res.status(404).json({ message: "Maintenance record not found" });
    }

    const vehicle = await Vehicle.findById(maintenance.vehicle);

    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    vehicle.status = "Available";
    await vehicle.save();

    res.json({
      message: "Maintenance completed successfully",
      vehicle
    });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};