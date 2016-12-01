process.env.TESTING = true;
const request = require('supertest');
const chai = require('chai');  
const assert = chai.assert;  
const expect = chai.expect;  
const should = chai.should();

const app = require('../index');
const User = require('../models/users');

const fakeUser1 = {username: 'user1', password: '123'};
const fakeUser2 = {username: 'user2', password: '123'};

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

    it('User should require username and password', (done) => {
      user = new User({})
        .save(err => {
          err.name.should.equal('ValidationError');
          done();
        });
    });

    it('User username field should be unique', (done) => {
      user = new User(fakeUser1)
        .save(err => {
          expect(err.toJSON().errmsg).to.contain('duplicate key error');
          done();
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
          done();
        });
    });

    it('"/user" GET should return all users - 2 users', (done) => {
      request(app)
        .get('/api/users')
        .end((err, res) => {
          res.body.results.should.have.length(2);
          done();
        })
    });

    it('"/user/:userId" GET should return one user object without password a property', (done) => {
      request(app)
        .get(`/api/users/${user._id}`)
        .end((err, res) => {
          assert.equal(res.body.results._id, user._id);
          expect(res.body.results).should.not.property('password');
          done();
        });
    });

    /*
    TODO
    /users POST
    /users/:userId PUT
    /users/:userId DELETE
    */

  }); // end User API
  
})