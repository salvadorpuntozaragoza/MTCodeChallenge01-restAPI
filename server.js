require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const secrets = require('./secrets');
const app = express();
const cors = require('cors');

const userRoutes = require('./routes/users');
const courseRoutes = require('./routes/courses');
const courseTakenRoutes = require('./routes/coursesTaken');

const PORT = 3002;

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on('error', (error) => console.log(error));
db.once('open', () => console.log('Conected to database'));

app.use(cors());
app.use(express.json());
app.set('key', secrets.KEY);

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', '*');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', false);

    // Pass to next layer of middleware
    next();
});

app.use('/users', userRoutes);
app.use('/courses', courseRoutes);
app.use('/coursesTaken', courseTakenRoutes);

app.listen(PORT, () => console.log('Server running on port: ', PORT));
