const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('config');
const restRouter = require('./routes');
const {wrapJSON: wrap} = require('./helpers/utils');

let mongoDB = process.env.MONGODB_URI || config.get('db.connectionString');
mongoose.connect(mongoDB, {useNewUrlParser: true}, (err) => {
  if (err) throw err;
  console.log('MongoDb Connected');
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// initialize our express app
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(logger('dev'));
app.use(cors());
app.use('/', restRouter);
app.use((req, res, next) => {
  const error = new Error('Not found');
  error.message = 'Invalid route';
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  console.log('in hete')
  if (error.isJoi) {
    error.status = 400;
  }
  res.status(error.status || 500);
  return res.json({
    status: false,
    message: error.message
  });
});

app.response.wrapJSON = function (obj) {
  this.json(wrap(obj));
};

module.exports = app;
