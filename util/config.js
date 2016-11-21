module.exports = {
  port: process.env.PORT || 3000,
  dbUri: process.env.TESTING ? 
    'mongodb://localhost:graphics_testing' :
    'mongodb://localhost:graphics',
}