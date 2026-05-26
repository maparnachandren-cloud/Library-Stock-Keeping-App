const mongoose = require('mongoose');

module.exports = mongoose.model(

  'User',

  new mongoose.Schema({

    name: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true,
      unique: true
    },

    age: {
      type: Number,
      required: true
    },

    phone: {
      type: String,
      required: true
    },

    education: {
      type: String,
      required: true
    },

    password: {
      type: String,
      required: true
    },

    role: {
      type: String,
      default: 'user'
    },

    isBlocked: {
      type: Boolean,
      default: false
    }

  })

);