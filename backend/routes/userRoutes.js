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
