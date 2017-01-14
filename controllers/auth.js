const User = require('../models/users');
const util = require('../util/auth');

module.exports = {
  signup: (req, res, next) => {
    const { username, password } = req.body;
    if (username && password) {
      User.findOne({username})
        .then(existingUser => {
          if (!existingUser) {
            const user = new User(req.body);
            user.save()
              .then(user => {
                const token = util.grantUserToken(user);
                // Remove sensitive information before sending to client
                user = user.toObject();
                delete user.password;
                delete user.isAdmin;
                const data = {token, success: true, message: 'User created.', results: user};
                return res.status(201).json(data);
              })
              .catch(err => {
                return res.status(500).json({success: false, message: `User creation error: ${err.message}`, results: [] });
              });
          }
          else {
            return res.status(422).json({success: false, message: 'Username already registered.', results: [] });
          }
        })
        .catch(err => {
          return res.status(500).json({success: false, message: `Signup error: ${err.message}`, results: [] });
        })
    } 
    else {
      return res.status(400).json({success: false, message: 'Signup requires username and password.', results: [] });
    }
  },
  signin: (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({success: false, message: 'Must provide username and password.', results: [] });
    } 
    User.findOne({username}).select('+password +isAdmin').exec()
      .then(user => {
        if (!user) {
          return res.status(404).json({success: false, message: 'Incorrect username and/or password', results: [] });
        }
        user.comparePassword(password, function(err, isMatch) {
          if (err) return err;
          if (!isMatch) {
            return res.status(404).json({success: false, message: 'Incorrect username and/or password', results: [] });
          }
          const token = util.grantUserToken(user);
          return res.status(200).json({token, success: true, message: 'Successful login.', results: user })
        });
      })
      .catch(err => {
        return res.status(500).json({success: false, message: `Signin error: ${err.message}`, results: [] });
      })
  } 
}