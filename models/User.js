const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    min: 6,
    max: 256,
  },
  name: {
    type: String,
    min: 6,
    max: 256,
  },
  password: {
    type: String,
    min: 6,
    max: 1024,
  },
  createdOn: {
    type: Date,
    default: Date.now,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
})

module.exports = mongoose.model('User', userSchema);