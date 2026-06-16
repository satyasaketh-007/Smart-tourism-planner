const mongoose = require("mongoose");

/**
 * users collection
 * Stores all registered accounts for the Smart Tour Planner.
 */
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      default: "",
      trim: true,
    },
    fullName: {
      type: String,
      default: "",
      trim: true,
    },
    phone: {
      type: String,
      default: "",
    },
    lastLoginAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, // adds createdAt, updatedAt
    collection: "users",
  }
);

module.exports = mongoose.model("User", userSchema);
