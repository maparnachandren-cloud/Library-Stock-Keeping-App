const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Request = require('../models/Request');

// GET ALL USERS (Admin)
router.get('/', async (req, res) => {
  try {
    const users = await User.find({ role: 'user' });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET SINGLE USER
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE USER PROFILE
router.put('/:id', async (req, res) => {
  try {
    const { name, age, phone, email } = req.body;

    // Name validation
    if (name && !/^[a-zA-Z\s]+$/.test(name)) {
      return res.status(400).json({ message: 'Name should only contain letters' });
    }

    // Age validation
    if (age && (Number(age) < 1 || Number(age) > 120)) {
      return res.status(400).json({ message: 'Age must be between 1 and 120' });
    }

    // Phone validation
    if (phone && !/^\d{10}$/.test(phone.toString())) {
      return res.status(400).json({ message: 'Phone number must be exactly 10 digits' });
    }

    // Email format
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedUser) return res.status(404).json({ message: 'User not found' });
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE USER (Admin)
router.delete('/:id', async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// BLOCK / UNBLOCK USER (Admin)
router.put('/:id/block', async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { isBlocked: req.body.isBlocked },
      { new: true }
    );
    if (!updatedUser) return res.status(404).json({ message: 'User not found' });
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET USER'S REQUESTS
router.get('/:userId/requests', async (req, res) => {
  try {
    const requests = await Request.find({
      userId: req.params.userId
    }).populate('bookId', 'title author');
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

// GET USER NOTIFICATIONS
router.get('/:userId/notifications', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Sort newest first
    const sorted = [...user.notifications].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    res.json(sorted);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// MARK ONE NOTIFICATION AS READ
router.put('/:userId/notifications/:notifId/read', async (req, res) => {
  try {
    await User.updateOne(
      { _id: req.params.userId, 'notifications._id': req.params.notifId },
      { $set: { 'notifications.$.isRead': true } }
    );
    res.json({ message: 'Marked as read' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// MARK ALL NOTIFICATIONS AS READ
router.put('/:userId/notifications/readall', async (req, res) => {
  try {
    await User.updateOne(
      { _id: req.params.userId },
      { $set: { 'notifications.$[].isRead': true } }
    );
    res.json({ message: 'All marked as read' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
