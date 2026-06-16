const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    travelerName: {
      type: String,
      default: "",
      trim: true,
    },
    phone: {
      type: String,
      default: "",
      trim: true,
    },
    travelDate: {
      type: Date,
      default: null,
    },
    people: {
      type: Number,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
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
    perPerson: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    paymentTxnId: {
      type: String,
      required: true,
      unique: true,
    },
    paidAt: {
      type: Date,
      required: true,
    },
    cardHolder: {
      type: String,
      required: true,
    },
    cardLast4: {
      type: String,
      required: true,
      length: 4,
    },
    status: {
      type: String,
      enum: ["confirmed", "cancelled", "completed"],
      default: "confirmed",
    },
  },
  {
    timestamps: true,
    collection: "bookings",
  }
);

module.exports = mongoose.model("Booking", bookingSchema);
