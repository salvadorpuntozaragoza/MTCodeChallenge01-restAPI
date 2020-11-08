const express = require('express');
const router = express.Router();
const Course = require('../models/course');
const auth = require('../middlewares/routeAuthorization');

// GET ALL
router.get('/', auth, async (req, res) => {
  try{
    const course = await Course.find();
    res.status(200).json({ data: course, isValid: true, success: true, message: '' });
  } catch(error) {
    res.status(500).json({ data: course, isValid: false, success: false, message: 'There was an error, try again later.' });
  }
});

//GET ONE
router.get('/:id', getCourse, (req, res) => {
  res.send(res.course);
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
    res.status(400).json({ message: error.message });
  }
});

//UPDATING ONE
router.patch('/:id', getCourse, async (req, res) => {
  if(req.body.courseName != null) {
    res.user.courseName = req.body.courseName;
  }
  if(req.body.accessLink != null) {
    res.user.accessLink = req.body.accessLink;
  }
  if(req.body.description != null) {
    res.user.description = req.body.description;
  }
  try {
    const updatedCourse = await res.course.save();
    res.json(updatedCourse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//DELETING ONE
router.delete('/:id', getCourse, async (req, res) => {
  try {
    await res.course.remove();
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

async function getCourse(req, res, next) {
  let course;
  try {
    course = await Course.findById(req.params.id)
    if (course == null) {
      return res.status(404).json({ message: 'Course not found' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }

  res.course = course;
  next();
}

module.exports = router;