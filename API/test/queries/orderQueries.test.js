/* eslint-env mocha */
import { assert } from 'chai';

import Data from '../../src/queries/orderQueries';

const customer = 'Adeolu';
const recipientName = 'John Doe';
const recipientPhone = '09009054321';
const recipientAddress = '32 Araomi Onike Yaba';
const order = [{ mealId: 90, quantity: 2 }];

const invalidId = 75332;
const newStatus = 'completed';

let result;

describe('orderQueries', () => {  
  describe('Data.deleteAllOrders', () => {
    it('should delete all orders', (done) => {
      Data.deleteAllOrders();
      result = Data.getAllOrders();
      assert.isEmpty(result);
      done();
    });
  });

  beforeEach((done) => {
    Data.deleteAllOrders();
    done();
  });

  describe('Data.getAllOrders', () => {
    it('should return an array', (done) => {
      result = Data.getAllOrders();
      assert.isArray(result);
      done();
    });
  });

  describe('Data.createNewOrder', () => {
    it('should create a new order', (done) => {
      result = Data
        .createNewOrder(customer, recipientName, recipientAddress, recipientPhone, order);
      assert.isObject(result);
      assert.hasAllKeys(result, [
        'orderId',
        'customer',
        'recipientName',
        'recipientAddress',
        'recipientPhone',
        'order',
        'orderTime',
        'status',
      ]);
      done();
    });
  });

  describe('Data.getAnOrder', () => {
    it('should not get an order by an invalid Id', (done) => {
      Data.createNewOrder(customer, recipientName, recipientAddress, recipientPhone, order);
      result = Data.getAnOrder(invalidId);
      assert.isNull(result);
      done();
    });

    it('should get an order by its id', (done) => {
      const { orderId } = Data
        .createNewOrder(customer, recipientName, recipientAddress, recipientPhone, order);
      result = Data.getAnOrder(orderId);
      assert.isObject(result);
      assert.hasAllKeys(result, [
        'orderId',
        'customer',
        'recipientName',
        'recipientAddress',
        'recipientPhone',
        'order',
        'orderTime',
        'status',
      ]);
      done();
    });
  });

  describe('Data.updateAnOrder', () => {
    it('should not update an order status if id is invalid', (done) => {
      Data.createNewOrder(customer, recipientName, recipientAddress, recipientPhone, order);
      result = Data.updateOrderStatus(invalidId);
      assert.isNull(result);
      done();
    });

    it('should update an order by its id', (done) => {
      const { orderId } = Data
        .createNewOrder(customer, recipientName, recipientAddress, recipientPhone, order);
      result = Data.updateOrderStatus(orderId, newStatus);
      assert.isObject(result);
      assert.strictEqual(result.status, newStatus);
      done();
    });

    it('should create a timestamp for the new status update', (done) => {
      const { orderId } = Data
        .createNewOrder(customer, recipientName, recipientAddress, recipientPhone, order);
      result = Data.updateOrderStatus(orderId, newStatus);
      assert.hasAnyKeys(result, [`${newStatus}Time`]);
      done();
    });

  });
});
