const express = require('express');
const router = express.Router();
const Book = require('../models/Book');

// GET ALL BOOKS
router.get('/', async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET SINGLE BOOK
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ADD BOOK (Admin)
router.post('/', async (req, res) => {
  try {
    const {
      title, author, genre, description,
      price, coverImage, isbn, publicationYear
    } = req.body;

    if (!title || !author || !genre || !description || !price || !coverImage) {
      return res.status(400).json({ message: 'All required fields must be filled' });
    }

    const newBook = new Book({
      title,
      author,
      genre,
      description,
      price,
      coverImage,
      isbn: isbn || '',
      publicationYear: publicationYear || null
    });

    const saved = await newBook.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE BOOK (Admin)
router.put('/:id', async (req, res) => {
  try {
    const updated = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Book not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE BOOK (Admin)
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Book.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Book not found' });
    res.json({ message: 'Book deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// TOGGLE LIKE (one like per user)
router.post('/:id/like', async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ message: 'userId required' });

    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    const alreadyLiked = book.likedBy.includes(userId);

    if (alreadyLiked) {
      // Unlike
      book.likedBy = book.likedBy.filter((id) => id !== userId);
      book.likes = Math.max(0, book.likes - 1);
    } else {
      // Like
      book.likedBy.push(userId);
      book.likes = book.likes + 1;
    }

    await book.save();
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// RATE BOOK (one rating per user, 1-5 only)
router.post('/:id/rate', async (req, res) => {
  try {
    const { userId, value } = req.body;

    if (!userId) return res.status(400).json({ message: 'userId required' });
    if (!value || value < 1 || value > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    // Remove previous rating by this user then add new one
    book.ratings = book.ratings.filter(
      (r) => r.userId.toString() !== userId.toString()
    );
    book.ratings.push({ userId, value: Number(value) });

    await book.save();
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ADD COMMENT (no empty comments)
router.post('/:id/comment', async (req, res) => {
  try {
    const { user, text } = req.body;

    if (!user) return res.status(400).json({ message: 'user required' });
    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Comment cannot be empty' });
    }

    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    book.comments.push({ user, text: text.trim() });
    await book.save();
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
