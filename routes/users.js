const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const User = require('../models/user');
const secrets = require('../secrets');
const jwt = require('jsonwebtoken');
const auth = require('../middlewares/routeAuthorization');

// GET ALL
router.get('/', async  (req, res) => {
  try{
    const user = await User.find();
    res.json(user);
  } catch(error) {
    console.log('Catched error in server: ', error)
    res.status(500).json({ message: error.message });
  }
});

// LOG IN USERS
router.post('/login', async (req, res) => {
  console.log(req.body);
  try {
    const user = await User.findOne({
      email: req.body.email,
    });
    console.log(user);
    if(user == null) {
      return res.status(404).json({ data: null, isValid: true, message: 'User not found', success: false }); 
    }
    if (user.length == 0) {
      return res.status(404).json({ data: null, isValid: true, message: 'User not found', success: false });
    }
    const match = await bcrypt.compare(req.body.password, user.password);
    if (match) {
      const token = jwt.sign({ check: true }, secrets.KEY, { expiresIn: 1440 * 7 })
      return res.status(200).json({ data: user, isValid: true, message: '', success: true, token });
    }
    return res.status(404).json({ data: null, isValid: true, message: 'Invalid password', success: false })
  } catch (error) {
    console.log(error);
    return res.status(500).json({ data: null, isValid: false, message: 'An error ocurred, try again later.', success: false });
  }
})

//CREATING ONE
router.post('/', emailAvailable, async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, secrets.SALT_ROUNDS);
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  });

  try {
    const newUser = await user.save();
    const token = jwt.sign({ check: true }, secrets.KEY, { expiresIn: 1440 * 7 });
    res.status(201).json({ data: newUser, isValid: true, message: '', success: true, token });
  } catch (error) {
    res.status(400).json({ data: null, isValid: false,  message: 'An error ocurred, try again later.', success: false });
  }
});

async function emailAvailable(req, res, next) {
  let user;
  try {
    user = await User.find({ email: req.body.email })
    if (user.length != 0) {
      return res.status(400).json({ data: null, isValid: true, message: 'Email already in use', success: false })
    }
  } catch (error) {
    return res.status(500).json({ data: null, isValid: false, message: 'An error ocurred, try again later.', success: false })
  }

  next();
}

async function getUser(req, res, next) {
  let user;
  try {
    user = await User.findById(req.params.id)
    if (user == null) {
      return res.status(404).json({ data: null, isValid: true, message: 'User not found', success: false });
    }
  } catch (error) {
    return res.status(500).json({ data: null, isValid: false, message: error.message, success: false });
  }

  res.user = user;
  next();
}

module.exports = router;

