const jwt = require('jwt-simple');
const secretKey = require('./config').secretKey;
const User = require('../models/users');

module.exports = {
  grantUserToken: (user) => {
    const timestamp = new Date().getTime();
    const data = {sub: user._id, isAdmin: user.isAdmin, iat: timestamp};
    return jwt.encode(data, secretKey);
  },
  requireAdmin: (req, res, next) => {
    const { isAdmin } = jwt.decode(req.headers.authorization, secretKey);
    if (!isAdmin) {
      return res.status(403).json({success: false, message: 'Unauthorized.', results: [] });
    }
    return next();
  }
}