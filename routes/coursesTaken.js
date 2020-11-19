const express = require('express');
const course = require('../models/course');
const router = express.Router();
const CourseTaken = require('../models/courseTaken');
const auth = require('../middlewares/routeAuthorization');
const Logger = require('../middlewares/logger');

// GET ALL
router.get('/', async (req, res) => {
  try{
    const courseTaken = await CourseTaken.find();
    res.status(200).json({ data: courseTaken, isValid: true, success: true, message: '' });
  } catch(error) {
    Logger.logError("Server", "No body due to get request", error.message);
    res.status(500).json({ data: null, isValid: false, success: false, message: 'An error ocurred, try again later.' });
  }
});

//CREATING ONE
router.post('/', auth, async (req, res) => {
  const courseTaken = new CourseTaken({
    userId: req.body.userId,
    userName: req.body.userName,
    courseId: req.body.courseId,
    courseName: req.body.courseName,
    courseDescription: req.body.courseDescription,
    courseAccessLink: req.body.courseAccessLink,
    hours: req.body.hours,
  });

  try {
    const newCourseTaken = await courseTaken.save();
    res.status(201).json({ data: newCourseTaken, isValid: true, success: true, message: '' });
  } catch (error) {
    Logger.logError("Server", req.body, error.message);
    res.status(400).json({ data: null, isValid: false, success: false, message: 'An error ocurred, try again later.' });
  }
});

//UPDATING ONE
router.patch('/:id', auth, getCourseTaken, async (req, res) => {
  if(req.body.userId != null) {
    res.courseTaken.userId = req.body.userId;
  }
  if(req.body.userName != null) {
    res.courseTaken.userName = req.body.userName;
  }
  if(req.body.courseId != null) {
    res.courseTaken.courseId = req.body.courseId;
  }
  if(req.body.courseName != null) {
    res.courseTaken.courseName = req.body.courseName;
  }
  if(req.body.courseDescription != null) {
    res.courseTaken.courseDescription = req.body.courseDescription;
  }
  if(req.body.courseAccessLink != null) {
    res.courseTaken.courseAccessLink = req.body.courseAccessLink;
  }
  if(req.body.hours != null) {
    res.courseTaken.hours = req.body.hours;
  }
  try {
    const updatedCourseTaken = await res.courseTaken.save();
    res.json({data: updatedCourseTaken, isValid: true, success: true, message: ''});
  } catch (error) {
    Logger.logError("Server", req.body, error.message);
    res.status(400).json({ data: null, isValid: true, success: false, message: error.message });
  }
});

//DELETING ONE
router.delete('/:id', auth, getCourseTaken, async (req, res) => {
  try {
    await res.courseTaken.remove();
    res.json({ data: null, isValid: true, success: true, message: 'Course taken removed successfully' });
  } catch (error) {
    Logger.logError("Server", req.body, error.message);
    res.status(500).json({ data: null, isValid: true, success: true, message: error.message });
  }
});

async function getCourseTaken(req, res, next) {
  let courseTaken;
  try {
    courseTaken = await CourseTaken.findById(req.params.id)
    if (courseTaken == null) {
      Logger.logError("Bad request", req.body, "Course taken not found");
      return res.status(404).json({ message: 'Course taken not found' });
    }
  } catch (error) {
    Logger.logError("Server", req.body, error.message);
    return res.status(500).json({ message: error.message });
  }

  res.courseTaken = courseTaken;
  next();
}

module.exports = router;