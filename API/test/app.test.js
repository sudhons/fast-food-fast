/* eslint-env mocha */
import chai, { assert } from 'chai';
import chaiHttp from 'chai-http';

import app from '../src/app';
import orderQueries from '../src/db/queries/orderQueries';

chai.use(chaiHttp);

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
  });
});
