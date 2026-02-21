const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, ".env") });

const Vehicle = require("./models/Vehicle");
const Driver = require("./models/Driver");
const User = require("./models/User");

const checkData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        const vehicleCount = await Vehicle.countDocuments();
        const availableVehicles = await Vehicle.countDocuments({ status: "Available" });
        const driverCount = await Driver.countDocuments();
        const availableDrivers = await Driver.countDocuments({ status: "Available" });
        const userCount = await User.countDocuments();

        console.log("--- Stats ---");
        console.log(`Total Vehicles: ${vehicleCount}`);
        console.log(`Available Vehicles: ${availableVehicles}`);
        console.log(`Total Drivers: ${driverCount}`);
        console.log(`Available Drivers: ${availableDrivers}`);
        console.log(`Total Users: ${userCount}`);

        if (vehicleCount === 0 || availableVehicles === 0) {
            console.log("Creating/Fixing test vehicles...");
            await Vehicle.deleteMany({ name: /Test/ });
            await Vehicle.create([
                { name: "Test Truck 1", licensePlate: "TS-01-AA-1111", maxCapacity: 10000, status: "Available" },
                { name: "Test Van 1", licensePlate: "TS-01-BB-2222", maxCapacity: 2000, status: "Available" }
            ]);
        }

        if (driverCount === 0 || availableDrivers === 0) {
            console.log("Creating/Fixing test drivers...");
            await Driver.deleteMany({ name: /Test/ });
            await Driver.create([
                { name: "Test Driver A", licenseNumber: "LIC001", licenseExpiry: "2030-01-01", category: "Truck", status: "Available" },
                { name: "Test Driver B", licenseNumber: "LIC002", licenseExpiry: "2030-01-01", category: "Van", status: "Available" }
            ]);
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkData();
