const express = require('express');
const router = express.Router();
const Book = require('../models/Book');

const currentYear = new Date().getFullYear();

// Valid author: letters, spaces, dots, hyphens, apostrophes (e.g. J.K. Rowling, Conan-Doyle)
const isValidAuthor = (val) => /^[a-zA-Z\s.\-']+$/.test(val.trim());

// Valid title: letters, numbers, spaces, basic punctuation
const isValidTitle = (val) => /^[a-zA-Z0-9\s.,!?'\-:&()]+$/.test(val.trim());

// Valid ISBN: 10 or 13 digits only
const isValidISBN = (val) => /^\d{10}$/.test(val) || /^\d{13}$/.test(val);

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
    const { title, author, genre, description, price, coverImage, isbn, publicationYear } = req.body;

    // Required fields
    if (!title || !author || !genre || !description || !price || !coverImage) {
      return res.status(400).json({ message: 'All required fields must be filled' });
    }

    // Title format
    if (!isValidTitle(title)) {
      return res.status(400).json({ message: 'Title contains invalid characters' });
    }

    // Author format
    if (!isValidAuthor(author)) {
      return res.status(400).json({ message: 'Author name should only contain letters, spaces, dots, or hyphens' });
    }

    // Description max length
    if (description.trim().length > 1000) {
      return res.status(400).json({ message: 'Description cannot exceed 1000 characters' });
    }

    // Price must be positive
    if (Number(price) <= 0) {
      return res.status(400).json({ message: 'Price must be greater than 0' });
    }

    // Publication year — integer, valid range
    if (publicationYear) {
      const yr = Number(publicationYear);
      if (!Number.isInteger(yr) || yr < 1450 || yr > currentYear) {
        return res.status(400).json({ message: `Publication year must be a whole number between 1450 and ${currentYear}` });
      }
    }

    // Cover image URL
    if (!coverImage.startsWith('http://') && !coverImage.startsWith('https://')) {
      return res.status(400).json({ message: 'Cover image must be a valid URL' });
    }

    // ISBN format if provided
    if (isbn && isbn.trim() && !isValidISBN(isbn.trim())) {
      return res.status(400).json({ message: 'ISBN must be exactly 10 or 13 digits' });
    }

    const newBook = new Book({
      title: title.trim(),
      author: author.trim(),
      genre,
      description: description.trim(),
      price: Number(price),
      coverImage,
      isbn: isbn ? isbn.trim() : '',
      publicationYear: publicationYear ? Number(publicationYear) : null
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
    const { title, author, price, publicationYear, coverImage, description, isbn } = req.body;

    if (title && !isValidTitle(title)) {
      return res.status(400).json({ message: 'Title contains invalid characters' });
    }

    if (author && !isValidAuthor(author)) {
      return res.status(400).json({ message: 'Author name should only contain letters, spaces, dots, or hyphens' });
    }

    if (description && description.trim().length > 1000) {
      return res.status(400).json({ message: 'Description cannot exceed 1000 characters' });
    }

    if (price !== undefined && Number(price) <= 0) {
      return res.status(400).json({ message: 'Price must be greater than 0' });
    }

    if (publicationYear) {
      const yr = Number(publicationYear);
      if (!Number.isInteger(yr) || yr < 1450 || yr > currentYear) {
        return res.status(400).json({ message: `Publication year must be a whole number between 1450 and ${currentYear}` });
      }
    }

    if (coverImage && !coverImage.startsWith('http://') && !coverImage.startsWith('https://')) {
      return res.status(400).json({ message: 'Cover image must be a valid URL' });
    }

    if (isbn && isbn.trim() && !isValidISBN(isbn.trim())) {
      return res.status(400).json({ message: 'ISBN must be exactly 10 or 13 digits' });
    }

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

// DELETE BOOK
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Book.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Book not found' });
    res.json({ message: 'Book deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// TOGGLE LIKE
router.post('/:id/like', async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ message: 'userId required' });

    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    const alreadyLiked = book.likedBy.includes(userId);
    if (alreadyLiked) {
      book.likedBy = book.likedBy.filter((id) => id !== userId);
      book.likes = Math.max(0, book.likes - 1);
    } else {
      book.likedBy.push(userId);
      book.likes = book.likes + 1;
    }

    await book.save();
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// RATE BOOK
router.post('/:id/rate', async (req, res) => {
  try {
    const { userId, value } = req.body;

    if (!userId) return res.status(400).json({ message: 'userId required' });

    const numValue = Number(value);
    if (!value || !Number.isInteger(numValue) || numValue < 1 || numValue > 5) {
      return res.status(400).json({ message: 'Rating must be a whole number between 1 and 5' });
    }

    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    book.ratings = book.ratings.filter(
      (r) => r.userId.toString() !== userId.toString()
    );
    book.ratings.push({ userId, value: numValue });

    await book.save();
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ADD COMMENT
router.post('/:id/comment', async (req, res) => {
  try {
    const { user, text } = req.body;

    if (!user) return res.status(400).json({ message: 'user required' });
    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Comment cannot be empty' });
    }
    if (text.trim().length > 500) {
      return res.status(400).json({ message: 'Comment cannot exceed 500 characters' });
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
