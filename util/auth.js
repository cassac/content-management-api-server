const jwt = require('jwt-simple');
const secretKey = require('./config').secretKey;
const User = require('../models/users');

module.exports = {
  grantUserToken: (user) => {
    const timestamp = new Date.getTime();
    return jwt.encode({userId: user._id}, secretKey);
  }
}