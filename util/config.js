const path = require('path');

module.exports = {
  secretKey: 'this needs to be more secret',
  port: process.env.PORT || 3000,
  dbUri: process.env.TESTING ? 
    'mongodb://localhost:db/graphics_testing' :
    'mongodb://localhost:db/graphics',
  uploadPath: (filename) => {
    const date = new Date();
    return path.join(
      date.getFullYear().toString(), 
      (date.getMonth() + 1).toString(),
      filename
    );
  },
  uploadDir: path.join(__dirname, '../uploads'),
  allowedFileTypes: [
    // Images
    'jpg', 'jpeg', 'png', 'gif',
    // Documents
    'pdf', 'doc', 'docx', 'key', 'ppt', 'pptx','pps',
    'ppsx', 'odt', 'xls', 'xlsx', 'zip',
    // Audio
    'mp3', 'm4a', 'ogg', 'wav',
    // Video
    'mp4', 'm4v', 'mov', 'wmv', 'avi', 'mpg', 'ogv',
    '3gp', '3g2',
  ],
}