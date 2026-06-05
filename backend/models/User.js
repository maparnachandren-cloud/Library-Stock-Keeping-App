const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  message:   { type: String, required: true },
  isRead:    { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model(
  'User',
  new mongoose.Schema({
    name:          { type: String, required: true },
    email:         { type: String, required: true, unique: true },
    age:           { type: Number, required: true },
    phone:         { type: String, required: true },
    place:         { type: String, required: true },
    education:     { type: String, required: true },
    password:      { type: String, required: true },
    role:          { type: String, default: 'user' },
    isBlocked:     { type: Boolean, default: false },
    notifications: { type: [notificationSchema], default: [] }
  })
);
