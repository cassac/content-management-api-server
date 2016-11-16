const User = require('../models/Users');

module.exports = {
  get: (req, res) => {
    const userId = req.params.userId;
    if (userId) {
      // logic for individual user
      res.json({success: true, message: `GET user: ${userId}`});
    } else {
      // logic to get all users
      res.json({success: true});
    }
  },
  post: (req, res) => {
    const user = req.body;
    // Create user logic
    res.json({success: true});
  },
  put: (req, res) => {
    const userId = req.params.userId;
    if (userId) {
      // logic for individual user
      res.json({success: true, message: `PUT user: ${userId}`});
    } else {
      res.json({success: true});
    }    
  },
  delete: (req, res) => {
    const userId = req.params.userId
    if (userId) {
      // logic for individual user
      res.json({success: true, message: `DELETE user: ${userId}`});
    }
    res.status(422).json({success: false, message: 'Must provide user id'});
  }
}