const mongoose = require("mongoose");
const https = require("https");
require("dotenv").config();

// Helper: fetch public IP for error diagnostics
const getPublicIP = () =>
  new Promise((resolve) => {
    https
      .get("https://api.ipify.org", (res) => {
        let data = "";
        res.on("data", (c) => (data += c));
        res.on("end", () => resolve(data.trim()));
      })
      .on("error", () => resolve("unknown"));
  });

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
      family: 4, // Force IPv4
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📦 Database:         ${conn.connection.name}`);
    console.log(`📋 Collections auto-created on first use: users, payments, trips\n`);
  } catch (err) {
    const ip = await getPublicIP();
    console.error("❌ MongoDB connection failed:", err.message);
    console.error("\n╔══════════════════════════════════════════════════════╗");
    console.error("║        FIX: Whitelist your IP in Atlas               ║");
    console.error("╠══════════════════════════════════════════════════════╣");
    console.error(`║  Your public IP: ${ip.padEnd(34)}║`);
    console.error("║                                                      ║");
    console.error("║  1. Go to https://cloud.mongodb.com                  ║");
    console.error("║  2. Security → Network Access → + Add IP Address     ║");
    console.error("║  3. Enter: 0.0.0.0/0  (Allow from Anywhere)          ║");
    console.error("║  4. Click Confirm, wait 30s, then restart server     ║");
    console.error("╚══════════════════════════════════════════════════════╝\n");
    process.exit(1);
  }
};

module.exports = connectDB;
