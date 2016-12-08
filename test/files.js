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

  describe('File Model', () => {
    
    it('Should throw validation error if all requird fields not provided', done => {
      const data = {
        ownerId: user1._id,
        // contentType: 'Required, but intentionally ignored for this test',
        filePath: '/path/to/file',
        fileSize: 5000000,
        comment: 'Comments are optional.'
      };
      const file = new File(data);
      file.save()
        .catch(err => {
          assert.equal(err.name, 'ValidationError');
          done();
        });
    });

    it('Should successfully add file to database', done => {
      const data = {
        ownerId: user1._id,
        contentType: 'application/pdf',
        filePath: '/test/assets/test.pdf',
        fileSize: 5000000,
        comment: 'Comments are optional.'
      }
      const file = new File(data);
      file.save()
        .then(file => {
          file.ownerId = data.ownerId;
          file._id.should.exist;
          file.createdAt.should.exist;
          file.updatedAt.should.exist;
          assert.equal(file.createdAt, file.updatedAt);
          done();
        });
    });

    // Update file comment
    // Check dates
    // Correct ownerId

  });

  // File API
    // '/users/:userId/files' GET
      // Auth
        // Require auth and user or admin
        // User can't requst other users files
      // Successful request response
        // Correct amount of files
        // Returns users own files
      // Unsuccesful request
        // File not found
    // '/users/:userId/files' POST
      // Auth
        // Require auth and user or admin
        // User can't post files to other user accounts
      // Successful post of file
        // Path exists in DB
        // Exists in directory
        // Returns correct response
      // Unsuccesful request
        // Incorrect file type
        // File not found
    // '/users/:userId/files/:fileId' GET
      // Auth
        // Require auth and user or admin
        // User can't request other users files
      // Successful request response
        // Returns single file
      // Unsuccesful request
        // File not found
    // '/users/:userId/files/:fileId' PUT
      // Auth
        // Require auth and user or admin
        // User can't put other users files
      // Successful request
        // Changes reflected in db
        // Returns updated instance
      // Unsuccesful request
        // File not found
    // '/users/:userId/files/:fileId' DELETE
      // Auth
        // Require auth and user or admin
        // User can't delete other users files
      // Successful delete request
        // Returns correct response
        // Deleted from DB
        // Removed from directory
      // Unsuccesful request
        // File not found
    // '/files' GET
      // Auth
        // Require auth and admin only
      // Successful request response
        // Correct amount of files from all users

});