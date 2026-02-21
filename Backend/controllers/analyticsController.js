const Vehicle = require("../models/Vehicle");
const Trip = require("../models/Trip");
const FuelLog = require("../models/FuelLog");
const Maintenance = require("../models/Maintenance");

exports.getVehicleAnalytics = async (req, res) => {
  try {
    const vehicleId = req.params.id;

    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    const trips = await Trip.find({
      vehicle: vehicleId,
      status: "Completed"
    });

    const fuelLogs = await FuelLog.find({ vehicle: vehicleId });
    const maintenanceLogs = await Maintenance.find({ vehicle: vehicleId });

    // 🚛 Total Distance
    let totalDistance = 0;
    trips.forEach(trip => {
      if (trip.endOdometer && trip.startOdometer) {
        totalDistance += (trip.endOdometer - trip.startOdometer);
      }
    });

    // ⛽ Fuel
    let totalFuel = 0;
    let totalFuelCost = 0;
    fuelLogs.forEach(log => {
      totalFuel += log.liters;
      totalFuelCost += log.cost;
    });

    // 🔧 Maintenance
    let totalMaintenanceCost = 0;
    maintenanceLogs.forEach(log => {
      totalMaintenanceCost += log.cost;
    });

    const totalOperationalCost = totalFuelCost + totalMaintenanceCost;

    // 💰 Revenue
    const totalRevenue = trips.reduce((sum, trip) => {
      return sum + (trip.revenue || 0);
    }, 0);

    // 📊 Calculations
    const costPerKm = totalDistance > 0
      ? totalOperationalCost / totalDistance
      : 0;

    const fuelEfficiency = totalFuel > 0
      ? totalDistance / totalFuel
      : 0;

    const roi = vehicle.acquisitionCost > 0
      ? (totalRevenue - totalOperationalCost) / vehicle.acquisitionCost
      : 0;

    res.json({
      totalDistance,
      totalFuel,
      totalFuelCost,
      totalMaintenanceCost,
      totalOperationalCost,
      totalRevenue,
      costPerKm,
      fuelEfficiency,
      roi
    });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};