'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _fs = require('fs');

var _bodyParser = require('body-parser');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var endpoints = require('./routes/endpoints');
var login_authorize = require('./routes/login_authorize');

var app = (0, _express2.default)();

// view engine setup
app.set('views', _path2.default.join(__dirname, 'views'));
app.set('view engine', 'jade');
var access = _path2.default.join(__dirname, 'access.log');
var accessLogStream = (0, _fs.createWriteStream)(access, { flags: 'a' });
app.use((0, _morgan2.default)('combined', { stream: accessLogStream }));
app.use((0, _morgan2.default)('dev'));
app.use((0, _bodyParser.json)());
app.use((0, _bodyParser.urlencoded)({ extended: false }));

app.use('/', login_authorize);
app.use('/api', [endpoints]);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

global.baseDirectory = _path2.default.resolve(__dirname);
// error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;