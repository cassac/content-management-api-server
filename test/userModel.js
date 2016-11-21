process.env.TESTING = true;
const request = require('supertest');
const chai = require('chai');  
const assert = chai.assert;  
const expect = chai.expect;  
const should = chai.should();

const app = require('../index.js');
const User = require('../models/Users.js');

const fakeUser1 = {email: 'abcdefg@123.com', password: '123'};
const fakeUser2 = {email: 'efg@123.com', password: '123'};

describe('User Model and API', () => {

  before(done => {    
    const user1 = new User(fakeUser1);
    const user2 = new User(fakeUser2);
    user1.save();
    user2.save(() => done() );    
  });  

  after(done => {    
    User.remove({}, () => done() );  
  });

  describe('User Model', () => {

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

  }); // end User Model

  describe('User API', () => {

    let user;

    before(done => {
      User.findOne({})
        .then(oneUser => {
          user = oneUser;
          done()
        })
    })

    it('"/user" GET should return all users - 2 users', (done) => {
      request(app)
        .get('/api/users')
        .end((err, res) => {
          res.body.should.have.length(2);
          done();
        })
    });

    it('"/user/:userId GET should return one user object without password a property', (done) => {
      request(app)
        .get(`/api/users/${user._id}`)
        .end((err, res) => {
          assert.equal(res.body.results._id, user._id);
          expect(res.body.results).should.not.property('password');
          done();
        });
    });

  }); // end User API
  
})