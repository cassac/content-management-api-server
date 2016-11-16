const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const path = require('path');
const port = require('./util/config').port;
const router = require('./util/routes');

const app = express();

app.use(express.static(path.join(__dirname, '../client/public')));
app.use('/api', router);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/public/index.html'));
})

app.listen(port, () => {
  console.log(`App running on port ${port}`)
})