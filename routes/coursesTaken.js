const express = require('express');
const course = require('../models/course');
const router = express.Router();
const CourseTaken = require('../models/courseTaken');

// GET ALL
router.get('/', async  (req, res) => {
  try{
    const courseTaken = await CourseTaken.find();
    res.json(courseTaken);
  } catch(error) {
    res.status(500).json({ message: error.message });
  }
});

//GET ONE
router.get('/:id', getCourseTaken, (req, res) => {
  res.send(res.courseTaken);
});

//CREATING ONE
router.post('/', async (req, res) => {
  const courseTaken = new CourseTaken({
    userName: req.body.userName,
    userId: req.body.userId,
    courseName: req.body.courseName,
    courseId: req.body.courseId,
    hours: req.body.hours,
  });

  try {
    const newCourseTaken = await courseTaken.save();
    res.status(201).json(newCourseTaken);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//UPDATING ONE
router.patch('/:id', getCourseTaken, async (req, res) => {
  if(req.body.userId != null) {
    res.user.userId = req.body.userId;
  }
  if(req.body.userName != null) {
    res.user.userName = req.body.userName;
  }
  if(req.body.courseId != null) {
    res.user.courseId = req.body.courseId;
  }
  if(req.body.courseName != null) {
    res.user.courseName = req.body.courseName;
  }
  if(req.body.hours != null) {
    res.user.hours = req.body.hours;
  }
  try {
    const updatedCourseTaken = await res.courseTaken.save();
    res.json(updatedCourseTaken);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//DELETING ONE
router.delete('/:id', getCourseTaken, async (req, res) => {
  try {
    await res.courseTaken.remove();
    res.json({ message: 'Course taken removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

async function getCourseTaken(req, res, next) {
  let courseTaken;
  try {
    courseTaken = await CourseTaken.findById(req.params.id)
    if (courseTaken == null) {
      return res.status(404).json({ message: 'Course taken not found' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }

  res.courseTaken = courseTaken;
  next();
}

module.exports = router;