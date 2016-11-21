const chai = require('chai');  
const assert = chai.assert;  
const expect = chai.expect;  
const should = chai.should();

const User = require('../models/Users.js');

const fakeUser = {email: 'abc@123.com', password: '123'};

describe('User model', () => {

  it('user should be an instance of User', () => {
    user = new User(fakeUser)
      .save(err => {
        if (err) throw err;
        expect(user instanceof User).to.equal(true);
      });
  });

  it('User should require email and password', () => {
    user = new User()
      .save(err => {
        expect(err).should.have.property('ValidationError');
      });
  })

});