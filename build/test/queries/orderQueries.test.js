'use strict';

var _chai = require('chai');

var _orderQueries = require('../../src/queries/orderQueries');

var _orderQueries2 = _interopRequireDefault(_orderQueries);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-env mocha */
var customer = 'Adeolu';
var recipientName = 'John Doe';
var recipientPhone = '09009054321';
var recipientAddress = '32 Araomi Onike Yaba';
var order = [{ mealId: 90, quantity: 2 }];

var invalidId = 75332;
var newStatus = 'completed';

var result = void 0;

describe('orderQueries', function () {
  describe('Data.deleteAllOrders', function () {
    it('should delete all orders', function (done) {
      _orderQueries2.default.deleteAllOrders();
      result = _orderQueries2.default.getAllOrders();
      _chai.assert.isEmpty(result);
      done();
    });
  });

  beforeEach(function (done) {
    _orderQueries2.default.deleteAllOrders();
    done();
  });

  describe('Data.getAllOrders', function () {
    it('should return an array', function (done) {
      result = _orderQueries2.default.getAllOrders();
      _chai.assert.isArray(result);
      done();
    });
  });

  describe('new Data', function () {
    it('should create a new order', function (done) {
      result = new _orderQueries2.default(customer, recipientName, recipientAddress, recipientPhone, order);
      _chai.assert.isObject(result);
      _chai.assert.hasAllKeys(result, ['orderId', 'customer', 'recipientName', 'recipientAddress', 'recipientPhone', 'order', 'orderTime', 'status']);
      done();
    });
  });

  describe('Data.createNewOrder', function () {
    it('should create a new order', function (done) {
      result = _orderQueries2.default.createNewOrder(customer, recipientName, recipientAddress, recipientPhone, order);
      _chai.assert.isObject(result);
      _chai.assert.hasAllKeys(result, ['orderId', 'customer', 'recipientName', 'recipientAddress', 'recipientPhone', 'order', 'orderTime', 'status']);
      done();
    });
  });

  describe('Data.getAnOrder', function () {
    it('should not get an order by an invalid Id', function (done) {
      _orderQueries2.default.createNewOrder(customer, recipientName, recipientAddress, recipientPhone, order);
      result = _orderQueries2.default.getAnOrder(invalidId);
      _chai.assert.isNull(result);
      done();
    });

    it('should get an order by its id', function (done) {
      var _Data$createNewOrder = _orderQueries2.default.createNewOrder(customer, recipientName, recipientAddress, recipientPhone, order),
          orderId = _Data$createNewOrder.orderId;

      result = _orderQueries2.default.getAnOrder(orderId);
      _chai.assert.isObject(result);
      _chai.assert.hasAllKeys(result, ['orderId', 'customer', 'recipientName', 'recipientAddress', 'recipientPhone', 'order', 'orderTime', 'status']);
      done();
    });
  });

  describe('Data.updateAnOrder', function () {
    it('should not update an order status if id is invalid', function (done) {
      _orderQueries2.default.createNewOrder(customer, recipientName, recipientAddress, recipientPhone, order);
      result = _orderQueries2.default.updateOrderStatus(invalidId);
      _chai.assert.isNull(result);
      done();
    });

    it('should update an order by its id', function (done) {
      var _Data$createNewOrder2 = _orderQueries2.default.createNewOrder(customer, recipientName, recipientAddress, recipientPhone, order),
          orderId = _Data$createNewOrder2.orderId;

      result = _orderQueries2.default.updateOrderStatus(orderId, newStatus);
      _chai.assert.isObject(result);
      _chai.assert.strictEqual(result.status, newStatus);
      done();
    });

    it('should create a timestamp for the new status update', function (done) {
      var _Data$createNewOrder3 = _orderQueries2.default.createNewOrder(customer, recipientName, recipientAddress, recipientPhone, order),
          orderId = _Data$createNewOrder3.orderId;

      result = _orderQueries2.default.updateOrderStatus(orderId, newStatus);
      _chai.assert.hasAnyKeys(result, [newStatus + 'Time']);
      done();
    });
  });
});