const Trip = require("../models/Trip");
const Vehicle = require("../models/Vehicle");
const Driver = require("../models/Driver");
const FuelLog = require("../models/FuelLog");
const Maintenance = require("../models/Maintenance");

exports.getDashboardStats = async (req, res) => {
  try {
    const totalVehicles = await Vehicle.countDocuments();
    const activeFleet = await Vehicle.countDocuments({ status: "OnTrip" });
    const inShop = await Vehicle.countDocuments({ status: "InShop" });
    const available = await Vehicle.countDocuments({ status: "Available" });

    const totalDrivers = await Driver.countDocuments();
    const activeDrivers = await Driver.countDocuments({ status: "OnTrip" });
    const availableDrivers = await Driver.countDocuments({ status: "Available" });
    const suspendedDrivers = await Driver.countDocuments({ status: "Suspended" });

    const pendingCargo = await Trip.countDocuments({ status: "Draft" });

    // Financial Metrics
    const trips = await Trip.find({ status: "Completed" });
    const totalRevenue = trips.reduce((sum, trip) => sum + (trip.revenue || 0), 0);

    const fuelLogs = await FuelLog.find();
    const totalFuelCost = fuelLogs.reduce((sum, log) => sum + (log.cost || 0), 0);

    const maintenanceLogs = await Maintenance.find();
    const totalMaintenanceCost = maintenanceLogs.reduce((sum, log) => sum + (log.cost || 0), 0);

    const netProfit = totalRevenue - totalFuelCost - totalMaintenanceCost;

    // Safety Metrics
    const complianceScore = totalDrivers > 0
      ? (((totalDrivers - suspendedDrivers) / totalDrivers) * 100).toFixed(0)
      : 100;

    const utilizationRate = totalVehicles > 0
      ? ((activeFleet / totalVehicles) * 100).toFixed(1)
      : 0;

    res.json({
      totalVehicles,
      activeFleet,
      inShop,
      available,
      totalDrivers,
      activeDrivers,
      availableDrivers,
      suspendedDrivers,
      pendingCargo,
      utilizationRate: `${utilizationRate}%`,
      totalRevenue: `$${(totalRevenue / 1000).toFixed(1)}k`,
      totalFuelCost: `$${(totalFuelCost / 1000).toFixed(1)}k`,
      netProfit: `$${(netProfit / 1000).toFixed(1)}k`,
      complianceScore: `${complianceScore}%`,
      safetyAlerts: suspendedDrivers
    });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};