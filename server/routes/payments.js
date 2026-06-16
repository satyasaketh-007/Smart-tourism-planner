const express = require("express");
const Payment = require("../models/Payment");
const User = require("../models/User");

const router = express.Router();

// ──────────────────────────────────────────────
// POST /api/payments
// Save a new payment record after checkout
// ──────────────────────────────────────────────
router.post("/", async (req, res) => {
  try {
    const {
      userId,
      username,
      txnId,
      paidAt,
      cardHolder,
      cardLast4,
      perPerson,
      total,
      people,
      state,
      packageName,
      tier,
      nights,
      hotel,
      hotelStars,
      guide,
      inter,
      intra,
      highlights,
    } = req.body;

    // Validate required fields
    if (!userId || !txnId || !total) {
      return res.status(400).json({ error: "Missing required payment fields." });
    }

    // Verify user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Prevent duplicate txn
    const existing = await Payment.findOne({ txnId });
    if (existing) {
      return res.status(409).json({ error: "Payment with this transaction ID already exists." });
    }

    const payment = await Payment.create({
      userId,
      username: username || user.username,
      txnId,
      paidAt: paidAt ? new Date(paidAt) : new Date(),
      cardHolder,
      cardLast4,
      perPerson,
      total,
      people,
      state,
      packageName,
      tier,
      nights,
      hotel,
      hotelStars,
      guide,
      inter,
      intra,
      highlights: highlights || [],
      status: "paid",
    });

    console.log(`💳 Payment saved: ${txnId} by ${username} — ₹${total}`);

    return res.status(201).json({
      message: "Payment recorded successfully.",
      payment,
    });
  } catch (err) {
    console.error("Payment save error:", err);
    return res.status(500).json({ error: "Server error. Could not save payment." });
  }
});

// ──────────────────────────────────────────────
// GET /api/payments/:userId
// Get all payments for a specific user (newest first)
// ──────────────────────────────────────────────
router.get("/:userId", async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.params.userId })
      .sort({ paidAt: -1 })
      .lean();

    console.log(`📋 Fetched ${payments.length} payments for user ${req.params.userId}`);

    return res.status(200).json({ payments });
  } catch (err) {
    console.error("Payment fetch error:", err);
    return res.status(500).json({ error: "Server error. Could not fetch payments." });
  }
});

// ──────────────────────────────────────────────
// GET /api/payments/txn/:txnId
// Get a single payment by transaction ID
// ──────────────────────────────────────────────
router.get("/txn/:txnId", async (req, res) => {
  try {
    const payment = await Payment.findOne({ txnId: req.params.txnId }).lean();
    if (!payment) return res.status(404).json({ error: "Payment not found." });
    return res.status(200).json({ payment });
  } catch (err) {
    console.error("Payment txn fetch error:", err);
    return res.status(500).json({ error: "Server error." });
  }
});

module.exports = router;
