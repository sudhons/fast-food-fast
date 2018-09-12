'use strict';

var _chai = require('chai');

var _app = require('../src/app');

var _app2 = _interopRequireDefault(_app);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-env mocha */
describe('multiply', function () {
  it('should return 8', function () {
    _chai.assert.equal((0, _app2.default)(2, 4), 8);
  });
});