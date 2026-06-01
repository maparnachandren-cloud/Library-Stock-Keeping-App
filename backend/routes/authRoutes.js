const express = require('express');
const router = express.Router();
const User = require('../models/User');

// LOGIN
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  // Hardcoded admin check
  if (email === 'admin@library.com' && password === 'admin123') {
    return res.json({
      user: {
        _id: 'ADMIN_ROOT',
        name: 'System Admin',
        email,
        role: 'admin'
      }
    });
  }

  try {
    const user = await User.findOne({ email, password });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (user.isBlocked) {
      return res.status(403).json({ message: 'Account is blocked. Contact admin.' });
    }

    res.json({ user });
  } catch {
    res.status(500).json({ message: 'Server Error' });
  }
});

// SIGNUP
router.post('/signup', async (req, res) => {
  try {
    const { name, email, age, phone, place, education, password } = req.body;

    // All fields required
    if (!name || !email || !age || !phone || !place || !education || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Name — letters and spaces only
    if (!/^[a-zA-Z\s]+$/.test(name)) {
      return res.status(400).json({ message: 'Name should only contain letters' });
    }

    // Age — must be between 1 and 120
    if (Number(age) < 1 || Number(age) > 120) {
      return res.status(400).json({ message: 'Age must be between 1 and 120' });
    }

    // Phone — must be exactly 10 digits
    if (!/^\d{10}$/.test(phone.toString())) {
      return res.status(400).json({ message: 'Phone number must be exactly 10 digits' });
    }

    // Place — letters, spaces, commas, hyphens only
    if (!/^[a-zA-Z\s,\-.]+$/.test(place.trim())) {
      return res.status(400).json({ message: 'Place should only contain letters, spaces, or hyphens' });
    }

    // Password — minimum 6 characters
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Duplicate email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const newUser = new User({
      name, email, age: Number(age),
      phone: phone.toString(), place, education, password,
      role: 'user'
    });

    await newUser.save();
    res.status(201).json({ message: 'Account created successfully' });
  } catch {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
