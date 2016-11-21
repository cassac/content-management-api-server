const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = require('bluebird');

const userSchema = new Schema({
  email: { type: String, unique: true, lowercase: true, required: true },
  password: { type: String, required: true, select: false  },
  firstName: String,
  lastName: String,
  companyName: String
})

// userSchema.pre('save', (next) => {
//   const user = this;

//   console.log('user:', user);

//   // logic to hash and save password

// })

const UserModel = mongoose.model('user', userSchema);

module.exports = UserModel;