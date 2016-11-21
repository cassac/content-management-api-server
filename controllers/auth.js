const User = require('../models/users');
const util = require('../util/auth');

module.exports = {
 signup: (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    User.findOne({username})
      .then(existingUser => {
        if (!existingUser) {
          const user = new User(req.body);
          user.save()
            .then(user => {
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

 } 
}