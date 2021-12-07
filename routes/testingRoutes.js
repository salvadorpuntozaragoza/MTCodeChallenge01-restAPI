const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const User = require('../models/user');
const secrets = require('../secrets');
const jwt = require('jsonwebtoken');
const auth = require('../middlewares/routeAuthorization');
const Logger = require('../middlewares/logger');

router.post('/createmeal', async (req, res) => {
  const { title, category } = req.body;
  
  if (title === 'Duplicated') {
    return res.status(202).json({
      blocked: [
        category,
      ],
    })
  }

  return res.json({
    planId: 12,
    category,
  })
})

router.put('/createmeal', async (req, res) => {
  const { title, category } = req.body;

  if (title === 'Duplicated') {
    return res.status(202).json({
      blocked: [
        category
      ],
    })
  }

  return res.status(200).json({
    data: 'good',
  })
})

module.exports = router;
