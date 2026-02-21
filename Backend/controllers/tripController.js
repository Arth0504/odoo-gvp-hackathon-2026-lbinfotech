const Trip = require("../models/Trip");
const Vehicle = require("../models/Vehicle");
const Driver = require("../models/Driver");

// Create Trip (Draft)
exports.createTrip = async (req, res) => {
  try {
    const { vehicle, driver, cargoWeight, origin, destination } = req.body;

    const selectedVehicle = await Vehicle.findById(vehicle);
    const selectedDriver = await Driver.findById(driver);

    if (!selectedVehicle || !selectedDriver) {
      return res.status(404).json({ message: "Vehicle or Driver not found" });
    }

    if (cargoWeight > selectedVehicle.maxCapacity) {
      return res.status(400).json({ message: `Weight exceeds vehicle capacity (${selectedVehicle.maxCapacity}kg)` });
    }

    const trip = await Trip.create({
      vehicle,
      driver,
      cargoWeight,
      origin,
      destination,
      status: "Draft"
    });

    res.status(201).json(trip);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Dispatch Trip
exports.dispatchTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: "Trip not found" });
    if (trip.status !== "Draft") return res.status(400).json({ message: "Only Draft trips can be dispatched" });

    const vehicle = await Vehicle.findById(trip.vehicle);
    const driver = await Driver.findById(trip.driver);

    if (vehicle.status !== "Available" || driver.status !== "Available") {
      return res.status(400).json({ message: "Vehicle or Driver is currently busy" });
    }

    // License Expiry Check
    if (driver.licenseExpiry && new Date(driver.licenseExpiry) < new Date()) {
      return res.status(400).json({ message: `Driver license expired on ${new Date(driver.licenseExpiry).toLocaleDateString()}` });
    }

    trip.status = "Dispatched";
    trip.startOdometer = vehicle.odometer;
    vehicle.status = "OnTrip";
    driver.status = "OnTrip";

    await trip.save();
    await vehicle.save();
    await driver.save();

    res.json({ message: "Trip dispatched successfully", trip });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
// Get All Trips
exports.getTrips = async (req, res) => {
  try {
    const trips = await Trip.find()
      .populate("vehicle", "name licensePlate")
      .populate("driver", "name")
      .sort({ createdAt: -1 });
    res.json(trips);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Complete Trip
exports.completeTrip = async (req, res) => {
  try {
    let { endOdometer } = req.body;

    const trip = await Trip.findById(req.params.id);
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    if (trip.status !== "Dispatched") {
      return res.status(400).json({ message: "Only dispatched trips can be completed" });
    }

    const vehicle = await Vehicle.findById(trip.vehicle);
    const driver = await Driver.findById(trip.driver);

    // Default odometer if missing
    if (!endOdometer) {
      endOdometer = (vehicle.odometer || 0) + 50;
    }

    if (endOdometer < (vehicle.odometer || 0)) {
      return res.status(400).json({ message: `End odometer cannot be less than start (${vehicle.odometer})` });
    }

    trip.status = "Completed";
    trip.endOdometer = endOdometer;

    // Update vehicle odometer
    vehicle.odometer = endOdometer;

    // Make both available again
    vehicle.status = "Available";
    driver.status = "Available";

    await trip.save();
    await vehicle.save();
    await driver.save();

    res.json({ message: "Trip completed successfully", trip });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
// Cancel Trip
exports.cancelTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    if (trip.status === "Completed" || trip.status === "Cancelled") {
      return res.status(400).json({ message: "Trip already finalized" });
    }

    const vehicle = await Vehicle.findById(trip.vehicle);
    const driver = await Driver.findById(trip.driver);

    trip.status = "Cancelled";

    vehicle.status = "Available";
    driver.status = "Available";

    await trip.save();
    await vehicle.save();
    await driver.save();

    res.json({ message: "Trip cancelled successfully", trip });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};