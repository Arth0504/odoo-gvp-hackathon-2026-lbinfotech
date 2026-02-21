const Trip = require("../models/Trip");
const Vehicle = require("../models/Vehicle");
const Driver = require("../models/Driver");

// Create Trip
exports.createTrip = async (req, res) => {
  try {
    const { vehicle, driver, cargoWeight, origin, destination } = req.body;

    const selectedVehicle = await Vehicle.findById(vehicle);
    const selectedDriver = await Driver.findById(driver);

    if (!selectedVehicle || !selectedDriver) {
      return res.status(404).json({ message: "Vehicle or Driver not found" });
    }

    // 🚛 Capacity Check
    if (cargoWeight > selectedVehicle.maxCapacity) {
      return res.status(400).json({ message: "Cargo exceeds vehicle capacity" });
    }

    // 🚦 Vehicle Availability Check
    if (selectedVehicle.status !== "Available") {
      return res.status(400).json({ message: "Vehicle not available" });
    }

    // 👨‍✈️ Driver Availability Check
    if (selectedDriver.status !== "Available") {
      return res.status(400).json({ message: "Driver not available" });
    }

    // 📅 License Expiry Check
    if (new Date(selectedDriver.licenseExpiry) < new Date()) {
      return res.status(400).json({ message: "Driver license expired" });
    }

    const trip = await Trip.create({
      vehicle,
      driver,
      cargoWeight,
      origin,
      destination,
      status: "Dispatched",
      startOdometer: selectedVehicle.odometer
    });

    // 🔄 Auto Status Change
    selectedVehicle.status = "OnTrip";
    selectedDriver.status = "OnTrip";

    await selectedVehicle.save();
    await selectedDriver.save();

    res.status(201).json(trip);

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
// Complete Trip
exports.completeTrip = async (req, res) => {
  try {
    const { endOdometer } = req.body;

    const trip = await Trip.findById(req.params.id);
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    if (trip.status !== "Dispatched") {
      return res.status(400).json({ message: "Trip not active" });
    }

    const vehicle = await Vehicle.findById(trip.vehicle);
    const driver = await Driver.findById(trip.driver);

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

    if (trip.status !== "Dispatched") {
      return res.status(400).json({ message: "Only active trips can be cancelled" });
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