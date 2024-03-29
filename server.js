require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const secrets = require('./secrets');
const app = express();
const cors = require('cors');

const testingRoutes = require('./routes/testingRoutes');
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

app.use('/', testingRoutes)
app.use('/users', userRoutes);
app.use('/courses', courseRoutes);
app.use('/coursesTaken', courseTakenRoutes);

app.listen(PORT, () => console.log('Server running on port: ', PORT));
