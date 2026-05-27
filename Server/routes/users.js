const express = require("express");
const User = require("../models/User");
const { protect } = require("../middleware/auth");

const router = express.Router();

// GET /api/users/:id — get user profile
router.get("/:id", protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/users/profile — update profile
router.put("/profile", protect, async (req, res) => {
  try {
    const { name, bio } = req.body;
    const user = await User.findById(req.user._id);
    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;
    await user.save();
    res.json({ _id: user._id, name: user.name, username: user.username, bio: user.bio });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
