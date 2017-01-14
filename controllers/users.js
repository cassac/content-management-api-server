const User = require('../models/users');

module.exports = {
  get: (req, res, next) => {
    const userId = req.params.userId;
    if (userId) {
      User.findById(userId, (err, foundUser) => {
        if (err) return next(err);
        if (foundUser) res.status(200).json({success: true, message: 'User found.', results: foundUser});
        else res.status(404).json({success: false, message: 'User not found.'})
      })
    } else {
      User.find({}).select('+isAdmin').exec()
        .then(users => res.status(200).json({success: true, message: 'Users found.', results: users}))
        .catch(err => res.status(500).json({success: false, message: 'Error retreiving users', results: []}))
    }
  },
  post: (req, res, next) => {
    const user = new User(req.body);
    if (user) {
      user.save(err => {
        if (err) return res.status(400).json({success: false, message: 'Must provide required fields.'});
        res.status(201).json({success: true, message: 'User created.', results: user});
      });
    }
    else {
      res.status(400).json({success: false, message: 'Must provide user data.'});
    }
  },
  put: (req, res, next) => {
    const userId = req.params.userId;
    const userData = req.body;
    const options = {new: true}; // Returns updated object
    if (userId) {
      User.findByIdAndUpdate(userId, userData, options, (err, updatedUser) => {
        if (err) {
          return res.status(201).json({success: false, message: 'Username already registered.', results: [] });            
        }
        else if (updatedUser) {
          return res.status(200).json({success: true, message: `User ${userId} updated.`, results: updatedUser});
        }
        else {
          return res.status(404).json({success: false, message: `User ${userId} not found.`});
        }
      })
    } else {
      return res.status(400).json({success: false, message: 'Must provide user id.'});
    }    
  },
  delete: (req, res, next) => {
    const userId = req.params.userId;
    if (userId) {
      User.findByIdAndRemove(userId, (err, deletedUser) => {
        if (err) return next(user);
        else if (deletedUser) {
          res.status(200).json({success: true, message: `User: ${userId} deleted.`});
        }
        else {
          res.status(404).json({success: false, message: `User ${userId} not found.`});
        }
      });
    } else {
      res.status(400).json({success: false, message: 'Must provide user id.'});
    }
  }
}