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
      // TODO implement pagination. need to extend File model
      File.find({ownerId: userId})
        .then(files => {
          if (!files) {
            return res.status(200).json({success: true, message: 'User has no files.', results: []});
          }
          return res.status(200).json({success: true, message: 'Files retrieved.', results: files});
        })
        .catch(err => {
            return res.status(500).json({success: false, message: `Error retrieving files ${err.message}.`, results: []});
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
          return res.status(400).json({success: false, message: `File type .${fileExt} not allowed.`, results: {}});
        }
        if (size > config.maxFileSize) {
          return res.status(400).json({success: false, message: `File size may not exceed ${config.maxFileSize / 100000} MB.`, results: {}});
        }
        fs.readFileAsync(path, contents => contents)
          .then(contents => {
            fsPath.writeFile(pathModule.join(config.uploadDir, filePath), contents, (err) => {
              if (err) {
                return res.status(500).json({success: false, message: `Write file error: ${err.message}.`, results: {}});
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
                  return res.status(500).json({success: false, message: `Save file error: ${err.message}.`, results: {}});
                });
            });
          })
          .catch(err => {
            return res.status(500).json({success: false, message: `File read error: ${err.message}.`, results: {}});
          });
      }); // end form.parse
    }, // end userFiles POST
  },
  singleFile: {
    get: (req, res, next) => {
      const { userId, fileId } = req.params;
      File.findById(fileId)
        .then(file => {
          if (!file) {
            return res.status(404).json({success: false, message: `File not found. (ID: ${fileId})`});
          }
          if (userId !== file.ownerId && !req.isAdmin) {
            return res.status(403).json({success: false, message: 'Forbidden.', results: [] });
          }
          const filepath = pathModule.join(config.uploadDir, file.filePath)
          return res.download(filepath);
        })
        .catch(err => {
          if (err.name === 'CastError') {
            return res.status(404).json({success: false, message: `File not found. (ID: ${fileId})`, results: {}});  
          }
          return res.status(500).json({success: false, message: 'Error retrieving file.', results: {}});
        });
    },
    put: (req, res, next) => {
      const { userId, fileId } = req.params;
      const { comment } = req.body;
      File.findById(fileId)
        .then(file => {
          if (!file) {
            return res.status(404).json({success: false, message: `File not found. (ID: ${fileId})`});
          }
          if (userId !== file.ownerId && !req.isAdmin) {
            return res.status(403).json({success: false, message: 'Forbidden.', results: [] });
          }
          file.comment = comment;
          file.save()
            .then(() => {
              return res.status(200).json({success: true, message: 'File updated.', results: file});
            })
            .catch(err => {
              return res.status(500).json({success: false, message: 'Error updating file.', results: {}});
            })            
        })
        .catch(err => {
          if (err.name === 'CastError') {
            return res.status(404).json({success: false, message: `File not found. (ID: ${fileId})`, results: {}});  
          }
          return res.status(500).json({success: false, message: 'Error retrieving file for update.', results: {}});
        })
    },
    delete: (req, res, next) => {
      const { userId, fileId } = req.params;
      File.findById(fileId)
        .then((file) => {
          if (userId !== file.ownerId && !req.isAdmin) {
            return res.status(403).json({success: false, message: 'Forbidden.', results: [] });
          }
          file.remove()
            .then(() => {
              fs.unlink(pathModule.join(config.uploadDir, file.filePath), err => {
                if (err) {
                  return res.status(500).json({success: false, message: `Error deleting file. (ID: ${fileId})`, results: {}});                  
                }
                return res.status(200).json({success: true, message: 'File deleted.', results: {}});          
              });
            })
            .catch(err => {
              return res.status(500).json({success: false, message: `Error deleting file. (ID: ${fileId})`, results: {}});
            });
        })
        .catch(err => {
          if (err.name === 'CastError') {
            return res.status(404).json({success: false, message: `File not found. (ID: ${fileId})`, results: {}});  
          }
          return res.status(500).json({success: false, message: `Error retrieving file for deletion. (ID: ${fileId})`, results: {}});          
        })
    },    
  },
  allFiles: {
    get: (req, res, next) => {
      // TODO implement pagination. need to extend File model with date field
      File.find({})
        .then(files => {
          return res.status(200).json({success: true, message: 'Files retrieved.', results: files});
        })
        .catch(err => {
          return res.status(500).json({success: false, message: 'Error retrieving files.', results: {}});          
        });
    },
  },
}