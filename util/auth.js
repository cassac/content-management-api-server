const jwt = require('jwt-simple');
const secretKey = require('./config').secretKey;
const User = require('../models/users');

module.exports = {
  grantUserToken: (user, isAdmin) => {
    isAdmin = isAdmin === true ? true : false;
    const timestamp = new Date.getTime();
    const data = {sub: user._id, admin: isAdmin, iat: timestamp};
    return jwt.encode(data, secretKey);
  },
}