const Vehicle = require("../models/Vehicle");
const Trip = require("../models/Trip");
const FuelLog = require("../models/FuelLog");
const Maintenance = require("../models/Maintenance");

exports.getFleetFinancials = async (req, res) => {
  try {
    const trips = await Trip.find({ status: "Completed" });
    const fuelLogs = await FuelLog.find();
    const maintenanceLogs = await Maintenance.find();

    const totalRevenue = trips.reduce((sum, trip) => sum + (trip.revenue || 0), 0);
    const totalFuelCost = fuelLogs.reduce((sum, log) => sum + (log.cost || 0), 0);
    const totalMaintenanceCost = maintenanceLogs.reduce((sum, log) => sum + (log.cost || 0), 0);

    const totalOperationalCost = totalFuelCost + totalMaintenanceCost;
    const netProfit = totalRevenue - totalOperationalCost;

    // ROI = (Revenue - (Maintenance + Fuel)) / Fleet Acquisition Value
    // Mocking fleet acquisition for aggregate ROI
    const fleetAcquisition = 5000000;

    const monthlyData = [
      { month: "Sep", revenue: totalRevenue * 0.12, expenses: totalOperationalCost * 0.15 },
      { month: "Oct", revenue: totalRevenue * 0.15, expenses: totalOperationalCost * 0.14 },
      { month: "Nov", revenue: totalRevenue * 0.18, expenses: totalOperationalCost * 0.17 },
      { month: "Dec", revenue: totalRevenue * 0.20, expenses: totalOperationalCost * 0.19 },
      { month: "Jan", revenue: totalRevenue * 0.15, expenses: totalOperationalCost * 0.16 },
      { month: "Feb", revenue: totalRevenue * 0.20, expenses: totalOperationalCost * 0.19 }
    ];

    res.json({
      totalRevenue,
      totalFuelCost,
      totalMaintenanceCost,
      operationalExpenses: totalOperationalCost,
      netProfit,
      efficiency: totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(1) : 0,
      roi: ((netProfit / fleetAcquisition) * 100).toFixed(1),
      monthlyData
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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

    // 📊 Calculations (As per Specification)
    const fuelEfficiency = totalFuel > 0
      ? totalDistance / totalFuel // km / L
      : 0;

    // ROI = (Revenue - (Maintenance + Fuel)) / Acquisition Cost
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