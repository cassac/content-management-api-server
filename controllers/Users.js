const User = require('../models/Users');

module.exports = {
  get: (req, res, next) => {
    const userId = req.params.userId;
    if (userId) {
      // logic for individual user
      User.findOne({id: userId}, (err, foundUser) => {
        if (err) return next(err);
        if (foundUser) {
          return res.json(foundUser)
        }
        return res.status(404).json({success: false, message: 'User not found.'})
      })
      res.json({success: true, message: `GET user: ${userId}`});
    } else {
      // logic to get all users
      res.json({success: true});
    }
  },
  post: (req, res, next) => {
    const user = req.body;
    // Create user logic
    res.json({success: true});
  },
  put: (req, res, next) => {
    const userId = req.params.userId;
    if (userId) {
      // logic for individual user
      res.json({success: true, message: `PUT user: ${userId}`});
    } else {
      res.json({success: true});
    }    
  },
  delete: (req, res, next) => {
    const userId = req.params.userId
    if (userId) {
      // logic for individual user
      res.json({success: true, message: `DELETE user: ${userId}`});
    }
    res.status(422).json({success: false, message: 'Must provide user id'});
  }
}