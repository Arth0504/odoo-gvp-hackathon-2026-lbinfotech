const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, ".env") });

const Vehicle = require("./models/Vehicle");
const Driver = require("./models/Driver");

const listData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        const vehicles = await Vehicle.find();
        const drivers = await Driver.find();

        console.log("--- Vehicles ---");
        vehicles.forEach(v => console.log(`ID: ${v._id}, Name: ${v.name}, Status: "${v.status}"`));

        console.log("--- Drivers ---");
        drivers.forEach(d => console.log(`ID: ${d._id}, Name: ${d.name}, Status: "${d.status}"`));

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

listData();
