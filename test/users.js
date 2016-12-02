process.env.TESTING = true;
const request = require('supertest');
const chai = require('chai');  
const assert = chai.assert;  
const expect = chai.expect;  
const should = chai.should();

const app = require('../index');
const User = require('../models/users');
const util = require('../util/auth');

const fakeAdmin = {username: 'admin', password: '123', isAdmin: true};
const fakeUser1 = {username: 'user1', password: '123'};
const fakeUser2 = {username: 'user2', password: '123'};

describe('User Model and API', () => {

  before(done => {
    User.create([fakeAdmin, fakeUser1, fakeUser2], () => {
      done();
    })   
  });  

  after(done => {    
    User.remove({}, () => done() );  
  });

  describe('User Model', () => {

    it('User collection should have two users', (done) => {
      User.find({})
        .then(users => {
          users.should.have.length(3);
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

  describe('User API Endpoints', () => {

    let admin, adminToken;
    let user, userToken;
    let targetUser1;
    let targetUser2;

    before(done => {
      User.find({}).select('+isAdmin').exec()
        .then(users => {
          admin = users[0];
          adminToken = util.grantUserToken(admin);
          return users;
        })
        .then((users) => {
          user = users[1];
          userToken = util.grantUserToken(user);
          return users;
        })
        .then((users) => {
          targetUser1 = users[2];
        })
        .then(done);
    });

    describe('Unauthenticated user access', () => {

      it('"/user" GET should return 401 Unauthorized', (done) => {
        request(app)
          .get('/api/users')
          .end((err, res) => {
            res.status.should.equal(401);
            res.text.should.equal('Unauthorized');
            done();
          })
      });

      it('"/user" POST should return 401 Unauthorized', (done) => {
        request(app)
          .post(`/api/users`, {
            username: 'user3',
            password: '123'
          })
          .end((err, res) => {
            res.status.should.equal(401);
            res.text.should.equal('Unauthorized');
            done();
          });
      });

      it('"/user/:userId" GET should return 401 Unauthorized', (done) => {
        request(app)
          .get(`/api/users/${targetUser1._id}`)
          .end((err, res) => {
            res.status.should.equal(401);
            res.text.should.equal('Unauthorized');
            done();
          });
      });

      it('"/user/:userId" PUT should return 401 Unauthorized', (done) => {
        request(app)
          .put(`/api/users/${targetUser1._id}`, {
            username: 'newusername'
          })
          .end((err, res) => {
            res.status.should.equal(401);
            res.text.should.equal('Unauthorized');
            done();
          });
      });

      it('"/user/:userId" DELETE should return 401 Unauthorized', (done) => {
        request(app)
          .delete(`/api/users/${targetUser1._id}`)
          .end((err, res) => {
            res.status.should.equal(401);
            res.text.should.equal('Unauthorized');
            done();
          });
      });

    });

    describe('Authenticated user - forbidden endpoints (admin only & other user assets)', () => {

      it('"/user" GET should return 403 Forbidden', (done) => {
        request(app)
          .get('/api/users')
          .set('authorization', userToken)
          .end((err, res) => {
            res.status.should.equal(403);
            res.body.message.should.equal('Forbidden');
            done();
          })
      });

      it('"/user" POST should return 403 Forbidden', (done) => {
        request(app)
          .post(`/api/users`)
          .set('authorization', userToken)
          .send({username: 'user3', password: '123'})
          .end((err, res) => {
            res.status.should.equal(403);
            res.body.message.should.equal('Forbidden');
            done();
          });
      });

      it('"/user/:userId" GET should return 403 Forbidden', (done) => {
        request(app)
          .get(`/api/users/${targetUser1._id}`)
          .set('authorization', userToken)
          .end((err, res) => {
            res.status.should.equal(403);
            res.body.message.should.equal('Forbidden');
            done();
          });
      });

      it('"/user/:userId" PUT should return 403 Forbidden', (done) => {
        request(app)
          .put(`/api/users/${targetUser1._id}`)
          .set('authorization', userToken)
          .send({username: 'newusername'})
          .end((err, res) => {
            res.status.should.equal(403);
            res.body.message.should.equal('Forbidden');
            done();
          });
      });

      it('"/user/:userId" DELETE should return 403 Forbidden', (done) => {
        request(app)
          .delete(`/api/users/${targetUser1._id}`)
          .set('authorization', userToken)
          .end((err, res) => {
            res.status.should.equal(403);
            res.body.message.should.equal('Forbidden');
            done();
          });
      });      

    });

    describe('Authenticated user - allowed endpoints (access user\'s own assets)', () => {
     
      it('"/user/:userId" GET should return 200 and user\'s own data', (done) => {
        request(app)
          .get(`/api/users/${user._id}`)
          .set('authorization', userToken)
          .end((err, res) => {
            res.status.should.equal(200);
            res.body.results._id.should.equal(String(user._id));
            done();
          });
      });

      it('"/user/:userId" GET should not return user password in response body', (done) => {
        request(app)
          .get(`/api/users/${user._id}`)
          .set('authorization', userToken)
          .end((err, res) => {
            res.status.should.equal(200);
            assert.equal(res.body.results.password, undefined)
            done();
          });
      });

      it('"/user/:userId" PUT should return 200 and updated user data', (done) => {
        request(app)
          .put(`/api/users/${user._id}`)
          .set('authorization', userToken)
          .send({username: 'newusername'})
          .end((err, res) => {
            res.status.should.equal(200);
            res.body.results.username.should.equal('newusername');
            done();
          });
      });

    });

    describe('Authenticated user - is admin (full access)', () => {

      it('"/user" GET should return 3 users', (done) => {
        request(app)
          .get('/api/users')
          .set('authorization', adminToken)
          .end((err, res) => {
            res.status.should.equal(200);
            res.body.results.should.have.length(3);
            done();
          })
      });

      it('"/user" POST should return 201 and new user data w/o password', (done) => {
        request(app)
          .post(`/api/users`)
          .set('authorization', adminToken)
          .send({username: 'user3', password: '123'})
          .end((err, res) => {
            targetUser2 = res.body.results;
            res.status.should.equal(201);
            res.body.results.username.should.equal('user3');
            expect(res.body.results).should.not.property('password');
            done();
          });
      });

      it('"/user/:userId" DELETE should return 204', (done) => {
        request(app)
          .delete(`/api/users/${targetUser2._id}`)
          .set('authorization', adminToken)
          .end((err, res) => {
            res.status.should.equal(204);
            done();
          });
      }); 

      it('"/user/:userId" GET deleted user should return 404 "User not found." ', (done) => {
        request(app)
          .get(`/api/users/${targetUser2._id}`)
          .set('authorization', adminToken)
          .end((err, res) => {
            res.status.should.equal(404);
            res.body.message.should.equal('User not found.');
            done();
          });
      });

      it('"/user/:userId" PUT should return 200 and updated user data', (done) => {
        request(app)
          .put(`/api/users/${user._id}`)
          .set('authorization', adminToken)
          .send({username: 'anothernewusername'})
          .end((err, res) => {
            res.status.should.equal(200);
            res.body.results.username.should.equal('anothernewusername');
            done();
          });
      });  

    });

    /*
    TODO
    /auth/signin
    /auth/signup
    */

  }); // end User API
  
});