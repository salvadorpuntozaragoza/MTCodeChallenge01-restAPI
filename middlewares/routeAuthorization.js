const express = require('express');
const jwt = require('jsonwebtoken');
const secrets = require('../secrets');
const routeProtector = express.Router();

routeProtector.use((req, res, next) => {
  const token = req.headers['access-token'];
  console.log(token ? token : 'No token');

  if (token) {
    jwt.verify(token, secrets.KEY, (err, decoded) => {      
      if (err) {
        console.log('Error verifying: ', err);
        return res.status(401).json({ data: null, isValid: true, success: false, message: "Invalid/Expired token" });    
      } else {
        console.log('Verified correctly');
        req.decoded = decoded;    
        next();
      }
    });
  } else {
    console.log('No token received');
    return res.status(401).json({ data: null, isValid: false, success: false, message: "Unauthorized" });    
  }
});

module.exports = routeProtector;
