const express = require('express');
const jwt = require('jsonwebtoken');
const secrets = require('../secrets');
const routeProtector = express.Router();

routeProtector.use((req, res, next) => {
  const token = req.headers['access-token'];

  if (token) {
    jwt.verify(token, secrets.KEY, (err, decoded) => {      
      if (err) {
        return res.status(401).json({ data: null, isValid: true, success: false, message: "Invalid/Expired token" });    
      } else {
        req.decoded = decoded;    
        next();
      }
    });
  } else {
    return res.status(401).json({ data: null, isValid: false, success: false, message: "Unauthorized" });    
  }
});

module.exports = routeProtector;
