const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const router = express.Router();

// ──────────────────────────────────────────────
// POST /api/auth/register
// Create a new user account
// ──────────────────────────────────────────────
router.post("/register", async (req, res) => {
  try {
    const { username, password, email, fullName, phone } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required." });
    }
    if (username.length < 2 || username.length > 50) {
      return res.status(400).json({ error: "Username must be 2–50 characters." });
    }
    if (password.length < 4) {
      return res.status(400).json({ error: "Password must be at least 4 characters." });
    }

    // Check if username already taken
    const existing = await User.findOne({ username: username.trim().toLowerCase() });
    if (existing) {
      return res.status(409).json({ error: "Username is already taken. Please choose another." });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      username: username.trim().toLowerCase(),
      passwordHash,
      email: email?.trim() || "",
      fullName: fullName?.trim() || "",
      phone: phone?.trim() || "",
      lastLoginAt: new Date(),
    });

    console.log(`✅ New user registered: ${user.username} (${user._id})`);

    return res.status(201).json({
      message: "Account created successfully!",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ error: "Server error. Please try again." });
  }
});

// ──────────────────────────────────────────────
// POST /api/auth/login
// Validate credentials and return user info
// ──────────────────────────────────────────────
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required." });
    }

    const user = await User.findOne({ username: username.trim().toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: "Invalid username or password." });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid username or password." });
    }

    // Update last login timestamp
    user.lastLoginAt = new Date();
    await user.save();

    console.log(`✅ User logged in: ${user.username} (${user._id})`);

    return res.status(200).json({
      message: `Welcome back, ${user.username}!`,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        lastLoginAt: user.lastLoginAt,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Server error. Please try again." });
  }
});

// ──────────────────────────────────────────────
// GET /api/auth/profile/:userId
// Fetch a user profile by ID
// ──────────────────────────────────────────────
router.get("/profile/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select("-passwordHash");
    if (!user) return res.status(404).json({ error: "User not found." });
    return res.status(200).json({ user });
  } catch (err) {
    console.error("Profile fetch error:", err);
    return res.status(500).json({ error: "Server error." });
  }
});

module.exports = router;
