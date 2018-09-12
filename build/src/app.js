'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _ordersRoute = require('./routes/ordersRoute');

var _ordersRoute2 = _interopRequireDefault(_ordersRoute);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

app.use('/api/v1', _ordersRoute2.default);

app.use(function (request, response, next) {
  var error = new Error('unknown url path');
  error.status = 404;
  return next(error);
});

// eslint-disable-next-line no-unused-vars
app.use(function (error, request, response, next) {
  var status = error.status || 400;
  response.status(status);
  return response.json({ status: status, message: error.message });
});

var PORT = parseInt(process.env.PORT, 10) || 5000;

if (require.main === module) {
  app.listen(PORT, function () {
    return console.log('Listening on port ' + PORT);
  });
}

exports.default = app;