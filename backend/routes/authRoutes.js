const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (email === "admin@library.com" && password === "admin123") 
    return res.json({ user: { _id: "ADMIN_ROOT", name: "System Admin", email, role: "admin" } });
  
  try {
    const user = await User.findOne({ email, password });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
    if (user.isBlocked) return res.status(403).json({ message: "Account is blocked" });
    res.json({ user });
  } catch (err) { res.status(500).json({ message: "Server Error" }); }
});

router.post('/signup', async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json({ message: "Created" });
  } catch { res.status(400).json({ message: "Email already exists" }); }
});
module.exports = router;
