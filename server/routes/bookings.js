const express = require("express");
const Booking = require("../models/Booking");
const User = require("../models/User");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const {
      userId,
      username,
      travelerName,
      phone,
      travelDate,
      people,
      state,
      packageTier,
      packageName,
      nights,
      hotel,
      hotelStars,
      guide,
      inter,
      intra,
      highlights,
      perPerson,
      total,
      paymentTxnId,
      paidAt,
      cardHolder,
      cardLast4,
    } = req.body;

    if (!userId || !paymentTxnId || !state || !packageName || !total) {
      return res.status(400).json({ error: "Missing required booking fields." });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const existing = await Booking.findOne({ paymentTxnId });
    if (existing) {
      return res.status(200).json({
        message: "Booking already exists.",
        booking: existing,
      });
    }

    const booking = await Booking.create({
      userId,
      username: username || user.username,
      travelerName: travelerName || user.fullName || user.username,
      phone: phone || user.phone || "",
      travelDate: travelDate ? new Date(travelDate) : null,
      people,
      state,
      packageTier,
      packageName,
      nights,
      hotel,
      hotelStars,
      guide,
      inter,
      intra,
      highlights: highlights || [],
      perPerson,
      total,
      paymentTxnId,
      paidAt: paidAt ? new Date(paidAt) : new Date(),
      cardHolder,
      cardLast4,
      status: "confirmed",
    });

    console.log(`Booking saved: ${paymentTxnId} by ${booking.username}`);

    return res.status(201).json({
      message: "Booking recorded successfully.",
      booking,
    });
  } catch (err) {
    console.error("Booking save error:", err);
    return res.status(500).json({ error: "Server error. Could not save booking." });
  }
});

router.get("/:userId", async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.params.userId })
      .sort({ paidAt: -1 })
      .lean();

    return res.status(200).json({ bookings });
  } catch (err) {
    console.error("Booking fetch error:", err);
    return res.status(500).json({ error: "Server error. Could not fetch bookings." });
  }
});

module.exports = router;
