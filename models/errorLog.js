const mongoose = require('mongoose');

const errorLogSchema = mongoose.Schema({
  error: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  level: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Errors log', errorLogSchema);