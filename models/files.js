const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = require('bluebird');

const fileSchema = new Schema({
  ownerId: { type: String, required: true },
  fileName: { type: String, required: true }, 
  fileType: { type: String, required: true },
  filePath: { type: String, required: true },
});

const FileModel = mongoose.model('file', fileSchema);

module.exports = FileModel;