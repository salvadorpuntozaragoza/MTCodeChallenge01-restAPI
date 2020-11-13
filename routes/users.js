const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const User = require('../models/user');
const secrets = require('../secrets');
const jwt = require('jsonwebtoken');
const auth = require('../middlewares/routeAuthorization');
const Logger = require('../middlewares/logger');

// GET ALL
router.get('/', async  (req, res) => {
  try{
    const user = await User.find();
    res.json(user);
  } catch(error) {
    Logger.logError("Server", "No body due to get request", error.message);
    console.log('Catched error in server: ', error)
    res.status(500).json({ message: error.message });
  }
});

router.get('/authorize', auth, (req, res) => {
  console.log("Authorized");
  return res.status(200).json({ data: null, isValid: true, success: true, message: '' });
})

// LOG IN USERS
router.post('/login', async (req, res) => {
  console.log(req.body);
  try {
    const user = await User.findOne({
      email: req.body.email,
    });
    console.log(user);
    if(user == null) {
      Logger.logError("Bad request", req.body, "User not found");
      return res.status(404).json({ data: null, isValid: true, message: 'User not found', success: false }); 
    }
    if (user.length == 0) {
      Logger.logError("Bad request", req.body, "User not found");
      return res.status(404).json({ data: null, isValid: true, message: 'User not found', success: false });
    }
    const match = await bcrypt.compare(req.body.password, user.password);
    if (match) {
      const token = jwt.sign({ check: true }, secrets.KEY, { expiresIn: 1440 * 7 })
      return res.status(200).json({ data: user, isValid: true, message: '', success: true, token });
    }
    Logger.logError("Bad request", req.body, "Invalid password");
    return res.status(404).json({ data: null, isValid: true, message: 'Invalid password', success: false })
  } catch (error) {
    Logger.logError("Server", req.body, error.message);
    return res.status(500).json({ data: null, isValid: false, message: 'An error ocurred, try again later.', success: false });
  }
})

//CREATING ONE
router.post('/register', emailAvailable, async (req, res) => {
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
    Logger.logError("Server", req.body, error.message);
    res.status(400).json({ data: null, isValid: false,  message: 'An error ocurred, try again later.', success: false });
  }
});

async function emailAvailable(req, res, next) {
  let user;
  try {
    user = await User.find({ email: req.body.email })
    if (user.length != 0) {
      Logger.logError("Bad request", req.body, "Email already in use");
      return res.status(400).json({ data: null, isValid: true, message: 'Email already in use', success: false });
    }
  } catch (error) {
    Logger.logError("Server", req.body, error.message);
    return res.status(500).json({ data: null, isValid: false, message: 'An error ocurred, try again later.', success: false });
  }

  next();
}

module.exports = router;

