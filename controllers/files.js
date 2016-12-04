var Promise = require('bluebird');
const pathModule = require('path');
const fsPath = require('fs-path');
const fs = Promise.promisifyAll(require('fs'));
const multiparty = require('multiparty');
const File = require('../models/files');
const uploadDir = require('../util/config').uploadDir;

module.exports = {
  userFiles: {
    get: (req, res, next) => {
      const { userId } = req.params;
      console.log('userId:', userId)
      File.findById(userId, (err, files) => {
        if (err) return next(err);
        res.status(200).json({success: true, message: 'User files retrieved.', results: files});
      });
    },
    post: (req, res, next) => {
      const { userId } = req.params;
      const form = new multiparty.Form();
      let count = 0;

      form.on('error', (err) => {
        console.log('Error parsing form: ' + err.stack);
      });

      let comment;

      form.on('field', (name, value) => {
        comment = value;
      })

      form.on('file', (name, file) => {
        const { originalFilename, path, size } = file;
        const contentType = file.headers['content-type'];

        fs.readFileAsync(path, contents => contents)
          .then(contents => {
            fsPath.writeFile(uploadDir(originalFilename), contents, (err) => {
              count++;
              console.log('success')
            });
          })
          .catch(err => console.log('read err:', err))

      });
       
      form.on('close', () => {
        res.status(201).json({success: true, message: 'Files uploading...', results: [] });
      });

      form.parse(req);

    },
  },
  singleFile: {
    get: (req, res, next) => {

    },
    put: (req, res, next) => {

    },
    delete: (req, res, next) => {

    },    
  },
  allFiles: {
    get: (req, res, next) => {

    },
  },
}