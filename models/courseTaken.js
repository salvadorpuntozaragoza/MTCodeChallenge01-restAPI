const mongoose = require('mongoose');
const CourseTakenSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  courseId: {
    type: String,
    required: true,
  },
  courseName: {
    type: String,
    required: true,
  },
  // courseDescription: {
  //   type: String,
  //   required: true,
  // },
  // courseAccessLink: {
  //   type: String,
  //   required: true,
  // },
  hours: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model('CoursesTaken', CourseTakenSchema);
