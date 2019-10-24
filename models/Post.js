const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    max: 256,
    min: 1,
    required: true,
  },
  text: {
    type: String,
    min: 128,
    required: true,
  },
  author: {
    type: String,
    min: 6,
    max: 256,
    required: true,
  },
  createdOn: {
    type: Date,
    default: Date.now,
  },
  updatedOn: {
    type: Date,
    default: Date.now,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
})

module.exports = mongoose.model('Post', postSchema);