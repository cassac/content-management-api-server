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
      return res.status(403).json({success: false, message: 'Forbidden.', results: [] });
    }
    req.isAdmin = isAdmin;
    return next();
  },
  requireUserOrAdmin: (req, res, next) => {
    const requestingUser = jwt.decode(req.headers.authorization, secretKey);
    const targetUser = req.params.userId;
    // Reject if requesting user is not an admin or requesting user is not target user
    if (!requestingUser.isAdmin && (requestingUser.sub !== targetUser)) {
      return res.status(403).json({success: false, message: 'Forbidden.', results: [] });
    }
    req.isAdmin = requestingUser.isAdmin;
    return next();
  },
  isAuthenticated: (req, res, next) => {
    let user;
    const { authorization } = req.headers;
    if (authorization) user = jwt.decode(authorization, secretKey);
    if (user) req.isAuthenticated = true;
    else req.isAuthenticated = false;
    return next();
  },
}