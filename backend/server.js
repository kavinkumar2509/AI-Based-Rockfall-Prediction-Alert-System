const auth = require("./middleware/auth");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Sensor = require("./models/Sensor");
const Alert = require("./models/Alert");
const User = require("./models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Error:", err));

app.get("/sensors", async (req, res) => {
  try {
    const sensorData = {
      vibration: +(Math.random() * 2).toFixed(2),
      slopeTilt: +(Math.random() * 20).toFixed(2),
      moisture: Math.floor(Math.random() * 100),
      rainfall: Math.floor(Math.random() * 15),
    };

    const reading = new Sensor(sensorData);
    await reading.save();

    if (sensorData.vibration > 1.5) {
      await Alert.create({
        type: "HIGH_VIBRATION",
        value: sensorData.vibration,
        message: "High vibration detected",
      });
    }

    if (sensorData.slopeTilt > 15) {
      await Alert.create({
        type: "HIGH_SLOPE",
        value: sensorData.slopeTilt,
        message: "Dangerous slope tilt detected",
      });
    }

    if (sensorData.moisture > 80) {
      await Alert.create({
        type: "HIGH_MOISTURE",
        value: sensorData.moisture,
        message: "High soil moisture detected",
      });
    }

    console.log("Saved:", reading);

    res.json(sensorData);
  } catch (error) {
    console.error("FULL ERROR:", error);
    res.status(500).json({
      message: "Error saving sensor data",
    });
  }
});

app.get("/history", async (req, res) => {
  try {
    const data = await Sensor.find()
      .sort({ timestamp: -1 })
      .limit(20);

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error fetching history",
    });
  }
});

app.get("/alerts", async (req, res) => {
  try {
    const alerts = await Alert.find()
      .sort({ timestamp: -1 })
      .limit(20);

    res.json(alerts);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error fetching alerts",
    });
  }
});

app.get("/risk", async (req, res) => {
  try {
    const latest = await Sensor.findOne().sort({ timestamp: -1 });

    if (!latest) {
      return res.status(404).json({
        message: "No sensor data found",
      });
    }

    let risk = "LOW";

    if (
      latest.vibration > 1.5 ||
      latest.slopeTilt > 15 ||
      latest.moisture > 80
    ) {
      risk = "HIGH";
    } else if (
      latest.vibration > 1.0 ||
      latest.slopeTilt > 10 ||
      latest.moisture > 60
    ) {
      risk = "MEDIUM";
    }

    res.json({
      risk,
      data: latest,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error calculating risk",
    });
  }
});
app.get("/dashboard-stats", async (req, res) => {
  try {
    const totalReadings = await Sensor.countDocuments();
    const totalAlerts = await Alert.countDocuments();

    const latest = await Sensor.findOne().sort({ timestamp: -1 });

    let latestRisk = "LOW";

    if (
      latest &&
      (
        latest.vibration > 1.5 ||
        latest.slopeTilt > 15 ||
        latest.moisture > 80
      )
    ) {
      latestRisk = "HIGH";
    } else if (
      latest &&
      (
        latest.vibration > 1.0 ||
        latest.slopeTilt > 10 ||
        latest.moisture > 60
      )
    ) {
      latestRisk = "MEDIUM";
    }

    res.json({
      totalReadings,
      totalAlerts,
      latestRisk,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error fetching dashboard stats",
    });
  }
});
app.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      password: hashedPassword,
    });

    await user.save();

    res.json({
      message: "User registered successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Registration failed",
    });
  }
});
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }
const token = jwt.sign(
  { id: user._id },
  process.env.JWT_SECRET,
  { expiresIn: "1d" }
);
    res.json({
      token,
      username: user.username,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Login failed",
    });
  }
});
app.get("/profile", auth, (req, res) => {
  res.json({
    message: "Protected route accessed",
    user: req.user,
  });
});
app.get("/test-user", async (req, res) => {
  const users = await User.find();

  res.json(users);
});
app.get("/create-test-user", async (req, res) => {
  const hashedPassword = await bcrypt.hash("123456", 10);

  const user = new User({
    username: "kavin",
    password: hashedPassword,
  });

  await user.save();

  res.json({
    message: "Test user created",
  });
});
app.get("/", (req, res) => {
  res.json({
    project: "AI-Based Rockfall Management System",
    status: "Running"
  });
});
app.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});