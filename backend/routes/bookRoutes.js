const express = require('express');
const router = express.Router();
const Book = require('../models/Book');

// ✅ GET ALL BOOKS (HOME PAGE NEEDS THIS)
router.get('/', async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ GET SINGLE BOOK
router.get('/:id', async (req, res) => {
  const book = await Book.findById(req.params.id);
  res.json(book);
});

// LIKE BOOK
router.post('/:id/like', async (req, res) => {
  const book = await Book.findById(req.params.id);
  book.likes = (book.likes || 0) + 1;
  await book.save();
  res.json(book);
});

// RATE BOOK
router.post('/:id/rate', async (req, res) => {
  const { userId, value } = req.body;

  const book = await Book.findById(req.params.id);

  if (!book.ratings) book.ratings = [];

  book.ratings = book.ratings.filter(
    (r) => r.userId.toString() !== userId
  );

  book.ratings.push({ userId, value });

  await book.save();
  res.json(book);
});

// COMMENT BOOK
router.post('/:id/comment', async (req, res) => {
  const { user, text } = req.body;

  const book = await Book.findById(req.params.id);

  if (!book.comments) book.comments = [];

  book.comments.push({
    user,
    text,
    createdAt: new Date()
  });

  await book.save();
  res.json(book);
});

module.exports = router;