'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _ordersController = require('../controllers/ordersController');

var _ordersController2 = _interopRequireDefault(_ordersController);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.get('/', function (request, response) {
  response.status(200);
  return response.json({ status: 200, message: 'Welcome to fast food fast' });
});

router.get('/orders', _ordersController2.default.getAllOrders);

exports.default = router;