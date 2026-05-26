const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({

  userId: String,

  value: Number

});

const commentSchema = new mongoose.Schema({

  user: String,

  text: String

});

const BookSchema = new mongoose.Schema({

  title: {
    type: String,
    required: true
  },

  author: {
    type: String,
    required: true
  },

  genre: {
    type: String,
    required: true
  },

  description: {
    type: String,
    required: true
  },

  price: {
    type: Number,
    required: true
  },

  coverImage: {
    type: String,
    required: true
  },

  isAvailable: {
    type: Boolean,
    default: true
  },

  ratings: {
    type: [ratingSchema],
    default: []
  },

  comments: {
    type: [commentSchema],
    default: []
  },

  likes: {
    type: Number,
    default: 0
  }

});

module.exports =
  mongoose.models.Book ||
  mongoose.model('Book', BookSchema);