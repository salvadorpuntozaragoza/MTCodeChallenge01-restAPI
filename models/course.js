const mongoose = require('mongoose');

const courseSchema = mongoose.Schema({
  courseName: {
    type: String,
    required: true,
  },
  accessLink: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  }
});

module.exports = mongoose.model('Courses', courseSchema);
