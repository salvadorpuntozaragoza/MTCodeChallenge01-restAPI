const express = require('express');
const router = express.Router();
const Course = require('../models/course');
const auth = require('../middlewares/routeAuthorization');
const Logger = require('../middlewares/logger');

// GET ALL
router.get('/', auth, async (req, res) => {
  try{
    const course = await Course.find();
    res.status(200).json({ data: course, isValid: true, success: true, message: '' });
  } catch(error) {
    Logger.logError("Server", "No body due to get request", error.message);
    res.status(500).json({ data: course, isValid: false, success: false, message: 'There was an error, try again later.' });
  }
});

//CREATING ONE
router.post('/', async (req, res) => {
  const course = new Course({
    courseName: req.body.courseName,
    accessLink: req.body.accessLink,
    description: req.body.description,
  });

  try {
    const newCourse = await course.save();
    res.status(201).json(newCourse);
  } catch (error) {
    Logger.logError("Server", req.body, error.message);
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;