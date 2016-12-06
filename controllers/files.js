var Promise = require('bluebird');
const pathModule = require('path');
const fsPath = require('fs-path');
const fs = Promise.promisifyAll(require('fs'));
const multiparty = require('multiparty');
const File = require('../models/files');
const config = require('../util/config');

module.exports = {
  userFiles: {
    get: (req, res, next) => {
      const { userId } = req.params;
      File.find({ownerId: userId}, (err, files) => {
        if (err) return next(err);
        res.status(200).json({success: true, message: 'User files retrieved.', results: files});
      });
    }, // end userFiles GET
    post: (req, res, next) => {
      const { userId } = req.params;
      const form = new multiparty.Form();
      form.parse(req, function(err, fields, files) {
        if (!fields.comment || !files.file) {
          return res.status(400).json({success: false, message: 'Comment and file field required in request.', results: {}});
        } 
        else if (!files.file.length) {
          return res.status(400).json({success: false, message: 'No file submitted in request.', results: {}});
        }
        else if (files.file.length > 1) {
          return res.status(400).json({success: false, message: 'Only one file per request.', results: {}});
        }
        const comment = fields.comment;
        const file = files.file[0];
        const { originalFilename, path, size } = file;
        const contentType = file.headers['content-type'];
        const filePath = config.uploadPath(originalFilename);
        const fileExt = originalFilename.split('.').pop().toLowerCase();
        // File type must be in allowedFileTypes and must have an extension
        if (!config.allowedFileTypes.includes(fileExt) || fileExt.length <= 1) {
          return res.json({success: false, message: `File type .${fileExt} not allowed.`, results: []});
        }
        if (size > config.maxFileSize) {
          return res.json({success: false, message: `File size may not exceed ${config.maxFileSize / 100000} MB.`, results: {}});
        }
        fs.readFileAsync(path, contents => contents)
          .then(contents => {
            fsPath.writeFile(pathModule.join(config.uploadDir, filePath), contents, (err) => {
              if (err) {
                return res.status(500).json({success: false, message: `Write file error: ${err.message}`, results: {}});
              }
              const userFile = new File({
                ownerId: userId,
                contentType,
                filePath,
                fileSize: size,
                comment
              });
              userFile.save()
                .then((newFile) => {
                  return res.status(201).json({success: true, message: `File uploaded successfully.`, results: newFile});
                })
                .catch(err => {
                  return res.status(500).json({success: false, message: `Save file error: ${err.message}`, results: {}});
                });
            });
          })
          .catch(err => {
            return res.status(500).json({success: false, message: `File read error: ${err.message}`, results: {}});
          });
      }); // end form.parse
    }, // end userFiles POST
  },
  singleFile: {
    get: (req, res, next) => {
      const { fileId } = req.params;
      File.findById(fileId)
        .then(file => {
          if (!file) {
            return res.status(404).json({success: false, message: `File not found. (${fileId})`});
          }
          return res.status(200).json({success: true, message: 'File found.', results: file});
        })
        .catch(err => {
          return res.status(500).json({success: false, message: 'Error retreiving file', results: {}});
        });
    },
    put: (req, res, next) => {
      const { fileId } = req.params;
      const { comment } = req.body;
      File.findByIdAndUpdate(fileId, {comment})
        .then(file => {
          if (!file) {
            return res.status(404).json({success: false, message: `File not found. (${fileId})`});
          }
          file = Object.assign(file, {comment});
          return res.status(200).json({success: true, message: 'File updated.', results: file});
        })
        .catch(err => {
          return res.status(500).json({success: false, message: 'Error updating file', results: {}});
        })
    },
    delete: (req, res, next) => {

    },    
  },
  allFiles: {
    get: (req, res, next) => {

    },
  },
}