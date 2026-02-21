const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema({
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vehicle",
    required: true
  },
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Driver",
    required: true
  },
  cargoWeight: {
    type: Number,
    required: true
  },
  origin: String,
  destination: String,
  status: {
    type: String,
    enum: ["Draft", "Dispatched", "Completed", "Cancelled"],
    default: "Draft"
  },
  startOdometer: Number,
  endOdometer: Number,
  revenue: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model("Trip", tripSchema);