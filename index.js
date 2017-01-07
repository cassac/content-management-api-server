const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const path = require('path');
const config = require('./util/config');
const router = require('./util/routes');

const app = express();

mongoose.connect(config.dbUri);

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use('/build', express.static(path.join(__dirname, '../client/public')));
app.use('/api', router.apiRouter);
app.use('/auth', router.authRouter);
app.use('/', router.staticRouter);

app.get('/dashboard*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/public/index.html'));
});

app.listen(config.port, () => {
  console.log(`App running on port ${config.port}`);
});

module.exports = app;