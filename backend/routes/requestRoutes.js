const express = require('express');
const router = express.Router();
const Request = require('../models/Request');
const Book = require('../models/Book');

// GET ALL REQUESTS (Admin)
router.get('/', async (req, res) => {
  try {
    const requests = await Request.find()
      .populate('userId', 'name email')
      .populate('bookId', 'title isAvailable');
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CREATE REQUEST (User)
router.post('/', async (req, res) => {
  try {
    const { userId, bookId } = req.body;

    if (!userId || !bookId) {
      return res.status(400).json({ message: 'userId and bookId are required' });
    }

    // Block duplicate pending request for same user + book
    const existing = await Request.findOne({ userId, bookId, status: 'Pending' });
    if (existing) {
      return res.status(400).json({ message: 'You already have a pending request for this book' });
    }

    // Block if book is already rented out
    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    if (!book.isAvailable) {
      return res.status(400).json({ message: 'Book is not available' });
    }

    const newRequest = await new Request({ userId, bookId }).save();
    res.status(201).json(newRequest);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE REQUEST STATUS (Admin)
router.put('/:id', async (req, res) => {
  try {
    const { status, bookId } = req.body;

    const validStatuses = ['Approved', 'Rejected', 'Returned'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const updated = await Request.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: 'Request not found' });

    // Update book availability based on status
    if (status === 'Approved') {
      await Book.findByIdAndUpdate(bookId, { isAvailable: false });
    } else if (status === 'Rejected' || status === 'Returned') {
      await Book.findByIdAndUpdate(bookId, { isAvailable: true });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE REQUEST (User cancels pending)
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Request.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Request not found' });
    res.json({ message: 'Request cancelled' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
