const Trip = require("../models/Trip");
const Vehicle = require("../models/Vehicle");
const Driver = require("../models/Driver");


// ============================
// 1️⃣ Create Trip (Draft Only)
// ============================
exports.createTrip = async (req, res) => {
  try {
    const { vehicle, driver, cargoWeight, origin, destination } = req.body;

    const selectedVehicle = await Vehicle.findById(vehicle);
    const selectedDriver = await Driver.findById(driver);

    if (!selectedVehicle || !selectedDriver) {
      return res.status(404).json({ message: "Vehicle or Driver not found" });
    }

    // Capacity Check
    if (cargoWeight > selectedVehicle.maxCapacity) {
      return res.status(400).json({ message: "Cargo exceeds vehicle capacity" });
    }

    // License Expiry Check
    if (new Date(selectedDriver.licenseExpiry) < new Date()) {
      return res.status(400).json({ message: "Driver license expired" });
    }

    // IMPORTANT: Draft only
    const trip = await Trip.create({
      vehicle,
      driver,
      cargoWeight,
      origin,
      destination,
      status: "Draft",
      startOdometer: selectedVehicle.odometer
    });

    res.status(201).json({
      message: "Trip created in Draft mode",
      trip
    });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// ============================
// 2️⃣ Dispatch Trip
// ============================
exports.dispatchTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    if (trip.status !== "Draft") {
      return res.status(400).json({ message: "Only draft trips can be dispatched" });
    }

    const vehicle = await Vehicle.findById(trip.vehicle);
    const driver = await Driver.findById(trip.driver);

    if (vehicle.status !== "Available") {
      return res.status(400).json({ message: "Vehicle not available" });
    }

    if (driver.status !== "Available") {
      return res.status(400).json({ message: "Driver not available" });
    }

    trip.status = "Dispatched";
    vehicle.status = "OnTrip";
    driver.status = "OnTrip";

    await trip.save();
    await vehicle.save();
    await driver.save();

    res.json({
      message: "Trip dispatched successfully",
      trip
    });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// ============================
// 3️⃣ Complete Trip
// ============================
exports.completeTrip = async (req, res) => {
  try {
    const { endOdometer, revenue } = req.body;

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
    trip.revenue = revenue || 0;

    vehicle.odometer = endOdometer;
    vehicle.status = "Available";
    driver.status = "Available";

    await trip.save();
    await vehicle.save();
    await driver.save();

    res.json({
      message: "Trip completed successfully",
      trip
    });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// ============================
// 4️⃣ Cancel Trip
// ============================
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

    res.json({
      message: "Trip cancelled successfully",
      trip
    });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};