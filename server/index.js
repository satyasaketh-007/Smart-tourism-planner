require("dotenv").config();
const express = require("express");
const cors = require("cors");
const os = require("os");
const mongoose = require("mongoose");
const https = require("https");

// Route imports
const authRoutes = require("./routes/auth");
const paymentRoutes = require("./routes/payments");
const tripRoutes = require("./routes/trips");

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Helper: detect LAN IP ────────────────────
const getLanIP = () => {
  const ifaces = os.networkInterfaces();
  for (const name of Object.keys(ifaces)) {
    for (const iface of ifaces[name]) {
      if (iface.family === "IPv4" && !iface.internal) return iface.address;
    }
  }
  return "localhost";
};

// ─── MongoDB connection with auto-retry ───────
let dbConnected = false;
let publicIP = "unknown";

// fetch public IP
const fetchPublicIP = () =>
  new Promise((resolve) => {
    https
      .get("https://api.ipify.org", (res) => {
        let data = "";
        res.on("data", (c) => (data += c));
        res.on("end", () => resolve(data.trim()));
      })
      .on("error", () => resolve("unknown"));
  });

fetchPublicIP().then((ip) => {
  publicIP = ip || "unknown";
});

const connectDB = async (isRetry = false) => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      family: 4,
    });

    dbConnected = true;

    console.log(`\n✅ MongoDB Connected: ${mongoose.connection.host}`);
    console.log(`📦 Database: ${mongoose.connection.name}`);
    console.log(`📋 Collections: users, payments, trips\n`);
  } catch (err) {
    if (!isRetry) {
      console.warn("\n⚠️ MongoDB not connected yet — retrying...");
      console.warn(
        `Whitelist your IP (${publicIP}) in MongoDB Atlas`
      );
    }

    setTimeout(() => connectDB(true), 10000);
  }
};

// ─── Middleware ───────────────────────────────
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Root Route ───────────────────────────────
app.get("/", (req, res) => {
  res.send("Backend Running");
});

// ─── Health check ─────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({
    status: dbConnected ? "ok" : "degraded",
    db: dbConnected
      ? "connected"
      : "disconnected — whitelist IP in Atlas",
    timestamp: new Date().toISOString(),
  });
});

// ─── DB-ready guard middleware ─────────────────
const requireDB = (req, res, next) => {
  if (!dbConnected) {
    return res.status(503).json({
      error: `Database not connected. Please whitelist your public IP (${publicIP}) in MongoDB Atlas.`,
    });
  }

  next();
};

// ─── API Routes ───────────────────────────────
app.use("/api/auth", requireDB, authRoutes);
app.use("/api/payments", requireDB, paymentRoutes);
app.use("/api/trips", requireDB, tripRoutes);

// ─── Global error handler ─────────────────────
app.use((err, req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error." });
});

// ─── Start ────────────────────────────────────
connectDB();

app.listen(PORT, "0.0.0.0", () => {
  const lan = getLanIP();

  console.log(`\n╔═══════════════════════════════════════════════╗`);
  console.log(`║       🚀 Smart Tour Planner Backend Live     ║`);
  console.log(`╠═══════════════════════════════════════════════╣`);
  console.log(`║ 🌐 Local:   http://localhost:${PORT}              ║`);
  console.log(`║ 🌐 Network: http://${lan}:${PORT}           ║`);
  console.log(`╚═══════════════════════════════════════════════╝\n`);
});
