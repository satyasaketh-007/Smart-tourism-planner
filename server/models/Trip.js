const mongoose = require("mongoose");

/**
 * trips collection
 * Stores each trip enrollment. Status is computed:
 *   - "upcoming"  : travelDate > today
 *   - "ongoing"   : travelDate <= today < travelDate + nights days
 *   - "completed" : travelDate + nights days <= today
 */
const tripSchema = new mongoose.Schema(
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

    // Traveler info from Plan form
    travelerName: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    travelDate: {
      type: Date,
      required: true,
    },
    people: {
      type: Number,
      required: true,
    },

    // Destination
    state: {
      type: String,
      required: true,
    },

    // Package details
    packageTier: {
      type: String,
      enum: ["low", "mid", "high"],
      required: true,
    },
    packageName: {
      type: String,
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

    // Payment link
    paymentTxnId: {
      type: String,
      required: true,
    },
    totalPaid: {
      type: Number,
      required: true,
    },

    // Status: auto-computed on save
    status: {
      type: String,
      enum: ["upcoming", "ongoing", "completed"],
      default: "upcoming",
    },

    bookedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    collection: "trips",
  }
);

// Auto-compute status before saving
tripSchema.pre("save", function (next) {
  const now = new Date();
  const start = new Date(this.travelDate);
  const end = new Date(start);
  end.setDate(end.getDate() + (this.nights || 1));

  if (now < start) {
    this.status = "upcoming";
  } else if (now >= start && now < end) {
    this.status = "ongoing";
  } else {
    this.status = "completed";
  }
  next();
});

module.exports = mongoose.model("Trip", tripSchema);
