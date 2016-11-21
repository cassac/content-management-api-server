const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = require('bluebird');
const bcrypt = require('bcrypt-nodejs');

const userSchema = new Schema({
  username: { type: String, unique: true, lowercase: true, required: true },
  email: {type: String, trim: true, index: true, unique: true, sparse: true, lowercase: true},
  password: { type: String, required: true, select: false  },
  isAdmin: { type: Boolean, default: false, select: false },
  firstName: String,
  lastName: String,
  companyName: String
})

userSchema.pre('save', function(next) {
  const user = this;

  bcrypt.genSalt(10, function(err, salt) {
    if (err) { return next(err); }

    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) { return next(err); }
      user.password = hash;
      next();
    });
    
  });

})

const UserModel = mongoose.model('user', userSchema);

module.exports = UserModel;