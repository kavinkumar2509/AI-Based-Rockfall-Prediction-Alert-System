const mongoose = require("mongoose");

const sensorSchema = new mongoose.Schema({
  vibration: Number,
  slopeTilt: Number,
  moisture: Number,
  rainfall: Number,
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Sensor", sensorSchema);