'use strict';

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _chaiHttp = require('chai-http');

var _chaiHttp2 = _interopRequireDefault(_chaiHttp);

var _app = require('../src/app');

var _app2 = _interopRequireDefault(_app);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import orderQueries from '../src/db/queries/orderQueries';

_chai2.default.use(_chaiHttp2.default); /* eslint-env mocha */


describe('App', function () {
  // beforeEach((done) => {
  //   orderQueries.deleteAllOrders();
  //   done();
  // });

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
        // assert.strictEqual(response.status, 200);
        _chai.assert.hasAllKeys(response.body, ['status', 'message']);
        done();
      });
    });
  });

  // describe('/GET /api/v1/questions', () => {
  //   it('should GET an empty array when there are no orders', (done) => {
  //     chai.request(app)
  //       .get('/api/v1/orders')
  //       .end((error, response) => {
  //         assert.strictEqual(response.type, 'application/json');
  //         assert.strictEqual(response.status, 200);
  //         assert.isArray(response.body);
  //         assert.hasAllKeys(response.body, ['status', 'message', 'data']);
  //         done();
  //       });
  //   });
  // });
});