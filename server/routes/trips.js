const express = require("express");
const Trip = require("../models/Trip");
const User = require("../models/User");

const router = express.Router();

// ──────────────────────────────────────────────
// POST /api/trips
// Enroll a new trip after payment confirmation
// ──────────────────────────────────────────────
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
      paymentTxnId,
      totalPaid,
    } = req.body;

    if (!userId || !travelDate || !state || !paymentTxnId) {
      return res.status(400).json({ error: "Missing required trip fields." });
    }

    // Verify user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Avoid duplicate enrollments for same txn
    const existing = await Trip.findOne({ paymentTxnId });
    if (existing) {
      // Return existing trip instead of error — idempotent
      console.log(`⚠️  Trip for txn ${paymentTxnId} already enrolled. Returning existing.`);
      return res.status(200).json({
        message: "Trip already enrolled.",
        trip: existing,
      });
    }

    const trip = await Trip.create({
      userId,
      username: username || user.username,
      travelerName: travelerName || user.fullName || user.username,
      phone: phone || user.phone || "",
      travelDate: new Date(travelDate),
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
      paymentTxnId,
      totalPaid,
      bookedAt: new Date(),
    });

    console.log(
      `🗺️  Trip enrolled: ${state} on ${travelDate} for ${username} — status: ${trip.status}`
    );

    return res.status(201).json({
      message: "Trip enrolled successfully.",
      trip,
    });
  } catch (err) {
    console.error("Trip enroll error:", err);
    return res.status(500).json({ error: "Server error. Could not enroll trip." });
  }
});

// ──────────────────────────────────────────────
// GET /api/trips/:userId
// Get all trips for a user (sorted: ongoing → upcoming → completed)
// ──────────────────────────────────────────────
router.get("/:userId", async (req, res) => {
  try {
    const trips = await Trip.find({ userId: req.params.userId })
      .sort({ travelDate: -1 })
      .lean();

    // Re-compute status in case dates have changed since last save
    const now = new Date();
    const enriched = trips.map((t) => {
      const start = new Date(t.travelDate);
      const end = new Date(start);
      end.setDate(end.getDate() + (t.nights || 1));
      let status;
      if (now < start) status = "upcoming";
      else if (now >= start && now < end) status = "ongoing";
      else status = "completed";
      return { ...t, status };
    });

    // Sort: ongoing first, then upcoming, then completed
    const order = { ongoing: 0, upcoming: 1, completed: 2 };
    enriched.sort((a, b) => (order[a.status] ?? 3) - (order[b.status] ?? 3));

    console.log(`🗺️  Fetched ${enriched.length} trips for user ${req.params.userId}`);

    return res.status(200).json({ trips: enriched });
  } catch (err) {
    console.error("Trips fetch error:", err);
    return res.status(500).json({ error: "Server error. Could not fetch trips." });
  }
});

// ──────────────────────────────────────────────
// GET /api/trips/status/:userId/:status
// Get trips filtered by status (upcoming/ongoing/completed)
// ──────────────────────────────────────────────
router.get("/status/:userId/:status", async (req, res) => {
  try {
    const { userId, status } = req.params;
    const validStatuses = ["upcoming", "ongoing", "completed"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status. Use: upcoming, ongoing, completed." });
    }

    const trips = await Trip.find({ userId, status }).sort({ travelDate: 1 }).lean();
    return res.status(200).json({ trips });
  } catch (err) {
    console.error("Filtered trips fetch error:", err);
    return res.status(500).json({ error: "Server error." });
  }
});

module.exports = router;
