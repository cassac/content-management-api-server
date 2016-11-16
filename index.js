const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const path = require('path');
const mongoose = require('mongoose');
const port = require('./util/config').port;
const router = require('./util/routes');

const app = express();

mongoose.connect('mongodb://localhost:graphics');

app.use(express.static(path.join(__dirname, '../client/public')));
app.use(bodyParser.json({ type: '*/*' }));
app.use('/api', router);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/public/index.html'));
})

app.listen(port, () => {
  console.log(`App running on port ${port}`)
})