const express = require('express');
// const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const path = require('path');
const config = require('./util/config');
const router = require('./util/routes');

const app = express();

mongoose.connect(config.dbUri);

app.use(express.static(path.join(__dirname, '../client/public')));
// app.use(bodyParser.json({ type: '*/*' }));
app.use('/api', router.apiRouter);
app.use('/auth', router.authRouter);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/public/index.html'));
});

app.listen(config.port, () => {
  console.log(`App running on port ${config.port}`);
});

module.exports = app;