process.env.TESTING = true;
const request = require('supertest');
const chai = require('chai');  
const assert = chai.assert;  
const expect = chai.expect;  
const should = chai.should();
const path = require('path');

const app = require('../index');
const User = require('../models/users');
const File = require('../models/files');
const util = require('../util/auth');

const fakeAdmin = {username: 'admin', password: '123', isAdmin: true};
const fakeUser1 = {username: 'user1', password: '123'};
const fakeUser2 = {username: 'user2', password: '123'};

const fakeFile1 = {file: path.join(__dirname, 'assets', 'test.png'), comment: 'This is a test file.'};
const fakeFile2 = {file: path.join(__dirname, 'assets', 'test.pdf'), comment: 'This is another test file.'};
const fakeFile3 = {file: path.join(__dirname, 'assets', 'test.fail'), comment: 'This file will be rejected.'};

describe('File Model and API', () => {

  let admin, adminToken;
  let user1, user1Token;
  let user2, user2Token;

  before('Create fake users.', done => {
    User.create([fakeAdmin, fakeUser1, fakeUser2], () => {
      done();
    })   
  }); 

  before('Retrieve fake users.', done => {
    User.find({}).select('+isAdmin').exec()
      .then(users => {
        admin = users[0];
        adminToken = util.grantUserToken(admin);
        return users;
      })
      .then((users) => {
        user1 = users[1];
        user2Token = util.grantUserToken(user1);
        return users;
      })
      .then((users) => {
        user2 = users[2];
        user2Token = util.grantUserToken(user2);
      })
      .then(done);  
  }); 

  after('Remove fake users.', done => {    
    User.remove({}, () => done() );  
  });

  after('Remove fake files.', done => {    
    File.remove({}, () => done() );  
  });

  it('Left off here', () => {
    console.log('testing 1, 2, 3...');
  });

});