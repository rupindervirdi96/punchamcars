const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { sendDreamCarEmail } = require("../services/mail");

const CarSchema = new mongoose.Schema({
  Brand: {
    type: String,
    required: true,
  },
  Model: {
    type: String,
    required: true,
  },
  Year: {
    type: Number,
    required: true,
  },
  Mileage: {
    type: Number,
    required: true,
  },
  BodyType: {
    type: String,
    required: true,
  },
  Price: {
    type: Number,
    required: true,
  },
  Photos: [String],
});

const ClientSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: true,
  },
  Email: {
    type: String,
    required: true,
  },
  Phone: {
    type: String,
    required: true,
  },
  BiweeklyBudget: {
    type: Number,
  },
  PreferredYearRange: {
    type: String,
  },
  CreditScore: {
    type: Number,
  },
  AdditionalDetails: {
    type: String,
  },
});

const Car = mongoose.model("car", CarSchema);

router.get("/cars", async (req, res) => {
  const cars = await Car.find();
  res.send(cars);
});

router.post("/dreamcar", async (req, res) => {
  try {
    const submission = req.body;

    // 1️⃣ Respond immediately (important for Render)
    res.status(200).json({ ok: true });

    // 2️⃣ Send email in background (do NOT await)
    sendDreamCarEmail(submission)
      .then((res) => {
        console.log(res.data);
      })
      .catch((error) => {
        console.error("Dream car email failed:", error);
      });

  } catch (error) {
    // This catch is now only for sync errors
    console.error("Dream car route error:", error);
    res.status(500).json({ ok: false });
  }
});


module.exports = router;
