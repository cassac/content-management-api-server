const User = require('../models/users');
const util = require('../util/auth');

module.exports = {
 signup: (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    User.findOne({username})
      .then(existingUser => {
        console.log('existingUser:', existingUser)
        if (!existingUser) {
          const user = new User(req.body);
          user.save()
            .then(user => {
              // TODO
              // send auth token
              const data = {success: true, message: 'User created.', results: user};
              return res.status(201).json(data);
            })
            .catch(err => {
              console.log('err user:', err)
              return next(err);
            });
        }
        else {
          return res.status(422).json({success: false, message: 'Username already registered.', results: [] });
        }
      })
      .catch(err => {
        console.log('not found:', err)
        return next(err);
      })
  } 
  else {
    console.log('must provide username and password')
  }
 },
 signin: (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({success: false, message: 'Must provide username and password.', results: [] });
  } 
  User.findOne({username}).select('+password').exec()
      .then(user => {
        if (!user) {
          return res.status(404).json({success: false, message: 'User not found.', results: [] });
        }
        user.comparePassword(password, function(err, isMatch) {
          if (err) return err;
          if (!isMatch) {
            return res.status(400).json({success: false, message: 'Incorrect username and/or password', results: [] });
          }
          let token = '1234'; // generate real token
          return res.status(200).json({token, success: true, message: 'Successful login.', results: []})
        });
      })
 } 
}