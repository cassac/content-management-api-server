const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = require('bluebird');
const bcrypt = require('bcrypt-nodejs');

const userSchema = new Schema(
  {
    username: { type: String, unique: true, lowercase: true, required: true },
    email: {type: String, lowercase: true, required: true},
    password: { type: String, required: true, select: false  },
    isAdmin: { type: Boolean, default: false, select: false },
    firstName: String,
    lastName: String,
    company: String,
  },
  {
    timestamps: true,
  }
);


const generateHash = function(user, cb) {

  bcrypt.genSalt(10, function(err, salt) {
    if (err) { return next(err); }

    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) return cb(err);
      user.password = hash;
      return cb();
    });
    
  });

}

userSchema.pre('save', function(next) {
  const user = this;
  generateHash(user, next);
});

userSchema.pre('findOneAndUpdate', function(next) {
  const user = this._update;
  if (!user.password) return next();
  generateHash(user, next);
});

userSchema.methods.comparePassword = function(providedPassword, cb) {
  bcrypt.compare(providedPassword, this.password, function(err, isMatch) {
    if (err) return cb(err);
    return cb(null, isMatch);
  });
}

const UserModel = mongoose.model('user', userSchema);

module.exports = UserModel;