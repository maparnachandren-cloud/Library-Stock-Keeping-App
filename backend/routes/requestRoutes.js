const express = require('express');
const router = express.Router();
const Request = require('../models/Request');
const Book = require('../models/Book');

router.get('/', async (req, res) => res.json(await Request.find().populate('userId', 'name email').populate('bookId', 'title isAvailable')));
router.post('/', async (req, res) => {
  const { userId, bookId } = req.body;
  if (await Request.findOne({ userId, bookId, status: 'Pending' })) return res.status(400).json({ message: "Pending request exists" });
  res.json(await new Request({ userId, bookId }).save());
});
router.put('/:id', async (req, res) => {
  const { status, bookId } = req.body;
  const updated = await Request.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (status === 'Approved') await Book.findByIdAndUpdate(bookId, { isAvailable: false });
  else if (status === 'Rejected' || status === 'Returned') await Book.findByIdAndUpdate(bookId, { isAvailable: true });
  res.json(updated);
});
router.delete('/:id', async (req, res) => res.json(await Request.findByIdAndDelete(req.params.id)));
module.exports = router;