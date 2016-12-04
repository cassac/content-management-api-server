const path = require('path');

module.exports = {
  secretKey: 'this needs to be more secret',
  port: process.env.PORT || 3000,
  dbUri: process.env.TESTING ? 
    'mongodb://localhost:db/graphics_testing' :
    'mongodb://localhost:db/graphics',
  uploadDir: (filename) => {
    const date = new Date();
    return path.join(
      __dirname, 
      '../uploads/', 
      date.getFullYear().toString(), 
      (date.getMonth() + 1).toString(),
      filename
    );
  },
}