const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = require('bluebird');

const fileSchema = new Schema(
  {
    ownerId: { type: String, required: true },
    contentType: { type: String, required: true },
    filePath: { type: String, required: true },
    fileSize: { type: Number, required: true },
    comment: String,
  },
  {
    timestamps: true,
  }
);

const FileModel = mongoose.model('file', fileSchema);

module.exports = FileModel;