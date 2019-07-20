const express = require('express');
const authRouter = require('./auth.routes');

const restRouter = express.Router();

const welcomeMsg = {
  msg: 'Welcome to WhosNext.IO',
  domain: 'https://whos-next-io.herokuapp.com',
  routes: {
    auth: '/auth',
    user: '/users'
  }
};

restRouter.get('/', (req, res) => {
  res.json(welcomeMsg);
});
restRouter.use('/auth', authRouter);


module.exports = restRouter;
