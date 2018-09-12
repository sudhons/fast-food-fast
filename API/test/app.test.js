/* eslint-env mocha */
import chai, { assert } from 'chai';
import chaiHttp from 'chai-http';

import app from '../src/app';
import orderQueries from '../src/queries/orderQueries';

chai.use(chaiHttp);

const customer = 'Adeolu';
const recipientName = 'John Doe';
const recipientPhone = '09009054321';
const recipientAddress = '32 Araomi Onike Yaba';
const order = [{ mealId: 90, quantity: 2 }];


describe('App', () => {
  beforeEach((done) => {
    orderQueries.deleteAllOrders();
    done();
  });

  describe('/GET /', () => {
    it('should return a 404 error', (done) => {
      chai.request(app)
        .get('/')
        .end((error, response) => {
          assert.strictEqual(response.status, 404);
          assert.hasAllKeys(response.body, ['status', 'message']);
          done();
        });
    });
  });

  describe('/GET /api/v1', () => {
    it('should return a welcome object', (done) => {
      chai.request(app)
        .get('/api/v1')
        .end((error, response) => {
          assert.hasAllKeys(response.body, ['status', 'message']);
          done();
        });
    });
  });

  describe('/GET /api/v1/orders', () => {
    it('should GET an empty array when there are no orders', (done) => {
      chai.request(app)
        .get('/api/v1/orders')
        .end((error, response) => {
          assert.strictEqual(response.status, 200);
          assert.hasAllKeys(response.body, ['status', 'message', 'data']);
          assert.isEmpty(response.body.data);
          done();
        });
    });

    it('should GET an array of orders', (done) => {
      orderQueries.createNewOrder(customer, recipientName, recipientAddress, recipientPhone, order);
      chai.request(app)
        .get('/api/v1/orders')
        .end((error, response) => {
          assert.strictEqual(response.status, 200);
          assert.hasAllKeys(response.body, ['status', 'message', 'data']);
          assert.isNotEmpty(response.body.data);
          done();
        });
    });
  });

  describe('/POST /api/v1/orders', () => {
    it('should not POST an order with no customer value', (done) => {
      chai.request(app)
        .post('/api/v1/orders')
        .send({ recipientName, recipientAddress, recipientPhone })
        .end((error, response) => {
          assert.strictEqual(response.status, 422);
          assert.hasAllKeys(response.body, ['status', 'message']);
          done();
        });
    });
  });

});
