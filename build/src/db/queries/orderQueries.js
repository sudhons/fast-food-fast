'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dbData = require('../dbData');

var _dbData2 = _interopRequireDefault(_dbData);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Data = function () {
  function Data(customer, recipientName, recipientAddr, recipientPhone, order) {
    _classCallCheck(this, Data);

    Data.count = Data.count ? Data.count + 1 : 1;

    this.orderId = Data.count;
    this.customer = customer;
    this.recipientName = recipientName;
    this.recipientAddress = recipientAddr;
    this.recipientPhone = recipientPhone;
    this.order = order;
    this.orderTime = Date.now();
    this.status = 'waiting';
  }

  _createClass(Data, null, [{
    key: 'createNewOrder',
    value: function createNewOrder(customer, recipientName, recipientAddr, recipientPhone, order) {
      var newOrder = new Data(customer, recipientName, recipientAddr, recipientPhone, order);
      _dbData2.default.push(newOrder);

      return newOrder || null;
    }
  }, {
    key: 'getAllOrders',
    value: function getAllOrders() {
      return _dbData2.default;
    }
  }, {
    key: 'getAnOrder',
    value: function getAnOrder(orderId) {
      var requiredOrder = _dbData2.default.find(function (order) {
        return order.orderId === orderId;
      });
      return requiredOrder || null;
    }
  }, {
    key: 'updateOrderStatus',
    value: function updateOrderStatus(orderId, status) {
      var requiredOrder = Data.getAnOrder(orderId);
      if (requiredOrder) {
        requiredOrder.status = status;
      }

      return requiredOrder || null;
    }
  }, {
    key: 'deleteAllOrders',
    value: function deleteAllOrders() {
      _dbData2.default.length = 0;
    }
  }]);

  return Data;
}();

exports.default = Data;