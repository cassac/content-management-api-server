const jwt = require('jwt-simple');
const secretKey = require('./config').secretKey;
const User = require('../models/users');

module.exports = {
  grantUserToken: (user) => {
    const timestamp = new Date().getTime();
    const data = {sub: user._id, admin: user.isAdmin, iat: timestamp};
    return jwt.encode(data, secretKey);
  },
}