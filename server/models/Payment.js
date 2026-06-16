const mongoose = require("mongoose");

/**
 * payments collection
 * Stores every completed payment transaction linked to a user.
 */
const paymentSchema = new mongoose.Schema(
  {
    // Link to users collection
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    username: {
      type: String,
      required: true,
    },

    // Transaction info
    txnId: {
      type: String,
      required: true,
      unique: true,
    },
    paidAt: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["paid", "failed", "refunded"],
      default: "paid",
    },

    // Card details (masked)
    cardHolder: {
      type: String,
      required: true,
    },
    cardLast4: {
      type: String,
      required: true,
      length: 4,
    },

    // Pricing
    perPerson: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    people: {
      type: Number,
      required: true,
    },

    // Trip / Package details
    state: {
      type: String,
      required: true,
    },
    packageName: {
      type: String,
      required: true,
    },
    tier: {
      type: String,
      enum: ["low", "mid", "high"],
      required: true,
    },
    nights: {
      type: Number,
      required: true,
    },
    hotel: {
      type: String,
      required: true,
    },
    hotelStars: {
      type: Number,
      required: true,
    },
    guide: {
      type: String,
      required: true,
    },
    inter: {
      type: String,
      required: true,
    },
    intra: {
      type: String,
      required: true,
    },
    highlights: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
    collection: "payments",
  }
);

module.exports = mongoose.model("Payment", paymentSchema);
