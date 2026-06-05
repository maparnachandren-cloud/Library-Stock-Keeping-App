const express = require('express');
const router = express.Router();
const Request = require('../models/Request');
const Book = require('../models/Book');
const User = require('../models/User');

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

    const existing = await Request.findOne({ userId, bookId, status: 'Pending' });
    if (existing) {
      return res.status(400).json({ message: 'You already have a pending request for this book' });
    }

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    if (!book.isAvailable) {
      return res.status(400).json({ message: 'Book is not available for rent' });
    }

    const newRequest = await new Request({ userId, bookId }).save();
    res.status(201).json(newRequest);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE REQUEST STATUS (Admin) — creates notification on Approved/Rejected/Returned
router.put('/:id', async (req, res) => {
  try {
    const { status, bookId } = req.body;

    const validStatuses = ['Approved', 'Rejected', 'Returned'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    if (!bookId) {
      return res.status(400).json({ message: 'bookId is required' });
    }

    const updated = await Request.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: 'Request not found' });

    // Update book availability
    if (status === 'Approved') {
      await Book.findByIdAndUpdate(bookId, { isAvailable: false });
    } else if (status === 'Rejected' || status === 'Returned') {
      await Book.findByIdAndUpdate(bookId, { isAvailable: true });
    }

    // Create notification for the user
    const book = await Book.findById(bookId);
    const bookTitle = book ? book.title : 'a book';

    const notificationMessages = {
      Approved: `Your rental request for "${bookTitle}" has been approved! You can now pick it up.`,
      Rejected: `Your rental request for "${bookTitle}" has been rejected.`,
      Returned: `Your return of "${bookTitle}" has been confirmed. Thank you!`
    };

    await User.findByIdAndUpdate(updated.userId, {
      $push: {
        notifications: {
          message: notificationMessages[status],
          isRead: false,
          createdAt: new Date()
        }
      }
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE REQUEST — restores book availability if approved
router.delete('/:id', async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    if (request.status === 'Approved') {
      await Book.findByIdAndUpdate(request.bookId, { isAvailable: true });
    }

    await Request.findByIdAndDelete(req.params.id);
    res.json({ message: 'Request cancelled' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
