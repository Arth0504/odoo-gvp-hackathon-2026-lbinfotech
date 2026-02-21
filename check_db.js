const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "Backend/.env") });

const Vehicle = require("./Backend/models/Vehicle");
const Driver = require("./Backend/models/Driver");
const User = require("./Backend/models/User");

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

        if (vehicleCount === 0) {
            console.log("No vehicles found. Creating some test data...");
            await Vehicle.create([
                { name: "Ashok Leyland 1615", licensePlate: "GJ-01-AA-1234", maxCapacity: 10000, status: "Available" },
                { name: "Tata Ace", licensePlate: "GJ-01-BB-5678", maxCapacity: 1500, status: "Available" }
            ]);
            console.log("Test vehicles created.");
        }

        if (driverCount === 0) {
            console.log("No drivers found. Creating some test data...");
            await Driver.create([
                { name: "Rajesh Kumar", licenseNumber: "DL1234567890", licenseExpiry: "2030-01-01", category: "Truck", status: "Available" },
                { name: "Suresh Singh", licenseNumber: "DL0987654321", licenseExpiry: "2030-01-01", category: "Van", status: "Available" }
            ]);
            console.log("Test drivers created.");
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkData();
