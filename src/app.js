const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const restRouter = require('./routes');
const { wrapJSON: wrap }= require('./helpers/utils');

// initialize our express app
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger('dev'));
app.use(cors());
app.use('/', restRouter);
app.use((req, res, next) => {
  const error = new Error('Not found');
  error.message = 'Invalid route';
  error.status = 404;
  next(error);
});

app.use((error, req, res) => {
  console.log(error);
  if (error.isJoi) {
    error.status = 400;
  }
  res.status(error.status || 500);
  return res.json({
    status: false,
    message: error.message
  });
});

app.response.wrapJSON = function(obj) {
  this.json(wrap(obj));
};

module.exports = app;
