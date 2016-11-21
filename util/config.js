module.exports = {
  secretKey: 'this needs to be more secret',
  port: process.env.PORT || 3000,
  dbUri: process.env.TESTING ? 
    'mongodb://localhost:db_testing' :
    'mongodb://localhost:db',
}