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
  MaxBudget: {
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
    await sendDreamCarEmail(submission);
    res.status(200).json({ ok: true });
  } catch (error) {
    console.error("Error sending dream car email", error);
    res.status(500).json({ ok: false, error: "Email failed" });
  }
});

module.exports = router;
