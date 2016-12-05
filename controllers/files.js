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

      form.on('error', (err) => {
        res.status(400).json({success: false, message: `${err.stack}`});
      });

      let comment;

      form.on('field', (name, value) => {
        comment = value;
      })

      form.on('file', (name, file) => {
        const { originalFilename, path, size } = file;
        const contentType = file.headers['content-type'];
        const filePath = config.uploadPath(originalFilename);
        const fileExt = originalFilename.split('.').pop().toLowerCase();

        // File type must be in allowedFileTypes and must have an extension
        if (!config.allowedFileTypes.includes(fileExt) || fileExt.length <= 1) {
          form.emit('error', {stack: `File type .${fileExt} not allowed.`})
        }

        fs.readFileAsync(path, contents => contents)
          .then(contents => {
            fsPath.writeFile(pathModule.join(config.uploadDir, filePath), contents, (err) => {
              if (err) return form.emit('error', {stack: `Write file error: ${err.message}` });
              const userFile = new File({
                ownerId: userId,
                contentType,
                filePath,
                fileSize: size,
                comment
              });
              userFile.save()
                .catch(err => form.emit('error', {stack: `Save file err: ${err.message}` }));
            });
          })
          .catch(err => console.log(`File read err: ${err.message}`));

      });
       
      form.on('close', () => {
        res.status(202).json({success: true, message: 'Files uploading...', results: [] });
      });

      form.parse(req);

    }, // end userFiles POST
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