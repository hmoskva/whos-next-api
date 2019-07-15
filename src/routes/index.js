const express = require('express');

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


module.exports = restRouter;
