'use strict';

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _chaiHttp = require('chai-http');

var _chaiHttp2 = _interopRequireDefault(_chaiHttp);

var _app = require('../src/app');

var _app2 = _interopRequireDefault(_app);

var _orderQueries = require('../src/queries/orderQueries');

var _orderQueries2 = _interopRequireDefault(_orderQueries);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-env mocha */
_chai2.default.use(_chaiHttp2.default);

var customer = 'Adeolu';
var recipientName = 'John Doe';
var recipientPhone = '09009054321';
var recipientAddress = '32 Araomi Onike Yaba';
var order = [{ mealId: 90, quantity: 2 }];

describe('App', function () {
  beforeEach(function (done) {
    _orderQueries2.default.deleteAllOrders();
    done();
  });

  describe('/GET /', function () {
    it('should return a 404 error', function (done) {
      _chai2.default.request(_app2.default).get('/').end(function (error, response) {
        _chai.assert.strictEqual(response.status, 404);
        _chai.assert.hasAllKeys(response.body, ['status', 'message']);
        done();
      });
    });
  });

  describe('/GET /api/v1', function () {
    it('should return a welcome object', function (done) {
      _chai2.default.request(_app2.default).get('/api/v1').end(function (error, response) {
        _chai.assert.hasAllKeys(response.body, ['status', 'message']);
        done();
      });
    });
  });

  describe('/GET /api/v1/orders', function () {
    it('should GET an empty array when there are no orders', function (done) {
      _chai2.default.request(_app2.default).get('/api/v1/orders').end(function (error, response) {
        _chai.assert.strictEqual(response.status, 200);
        _chai.assert.hasAllKeys(response.body, ['status', 'message', 'data']);
        _chai.assert.isEmpty(response.body.data);
        done();
      });
    });

    it('should GET an array of orders', function (done) {
      _orderQueries2.default.createNewOrder(customer, recipientName, recipientAddress, recipientPhone, order);
      _chai2.default.request(_app2.default).get('/api/v1/orders').end(function (error, response) {
        _chai.assert.strictEqual(response.status, 200);
        _chai.assert.hasAllKeys(response.body, ['status', 'message', 'data']);
        _chai.assert.isNotEmpty(response.body.data);
        done();
      });
    });
  });
});