const express = require('express');
const router = express.Router();
const User = require('../models/User');

// LOGIN
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Hardcoded admin check
  if (
    email === 'admin@library.com' &&
    password === 'admin123'
  ) {
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
      return res.status(403).json({ message: 'Account is blocked' });
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

    if (!name || !email || !age || !phone || !place || !education || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const newUser = new User({
      name,
      email,
      age,
      phone,
      place,
      education,
      password,
      role: 'user'
    });

    await newUser.save();
    res.status(201).json({ message: 'Account created successfully' });
  } catch {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
