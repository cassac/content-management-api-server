const chai = require('chai');  
const assert = chai.assert;  
const expect = chai.expect;  
const should = chai.should();
const mongoose = require('mongoose');
const User = require('../models/Users.js');

mongoose.connect('mongodb://localhost:graphics_test');

const fakeUser1 = {email: 'abcdefg@123.com', password: '123'};
const fakeUser2 = {email: 'efg@123.com', password: '123'};

describe('User model', () => {

  before(done => {    
    const user1 = new User(fakeUser1);
    const user2 = new User(fakeUser2);
    user1.save();
    user2.save(() => done() );    
  });  

  after(done => {    
    User.remove({}, () => done() );  
  });

  it('User collection should have two users', (done) => {
    User.find({})
      .then(users => {
        users.should.have.length(2);
        done();
      });
  });

  it('User should require email and password', () => {
    user = new User()
      .save(err => {
        expect(err).should.have.property('ValidationError');
      });
  });

  it('User should encrypt password on save', (done) => {
    User.findOne({}).select('+password').exec((err, user) => {
      user.password.should.not.equal('123')
      done();
    });
  });

});