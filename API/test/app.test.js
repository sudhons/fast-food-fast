import chai, { assert } from 'chai';
import chaiHttp from 'chai-http';

import app from '../src/app';
import orderQueries from '../src/queries/orderQueries';
import UsersDBQueries from '../src/queries/UsersDBQueries';

chai.use(chaiHttp);

const firstName = 'Sunday';
const lastName = 'Sunday';
const email = 'sunday@ymail.com';
const password = 'Sunday12';
const emptyPassword = ' ';

const recipientName = 'John Doe';
const wrongRecipientName = [];
const recipientPhone = 9009054321;
const wrongRecipientPhone = 'phonenumber';
const recipientAddress = '32 Araomi Onike Yaba';
const wrongRecipientAddress = {};
const order = [{ mealId: 90, quantity: 2 }];
const orderNoMealId = [{ quantity: 2 }];
const orderNoquantity = [{ mealId: 100 }];
const orderWrongMealId = [{ mealId: '90', quantity: 2 }];
const orderWrongQuantity1 = [{ mealId: 90, quantity: '2' }];
const orderWrongQuantity2 = [{ mealId: 90, quantity: 0 }];
const wrongOrderId = 39237;
const orderStatus = 'accepted';
const wrongStatus = 'wrong status';


describe('App', () => {
  beforeEach((done) => {
    orderQueries.deleteAllOrders();
    UsersDBQueries.deleteAllUsers();
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
          assert.strictEqual(response.status, 200);
          assert.hasAllKeys(response.body, ['status', 'message']);
          done();
        });
    });
  });

  describe('/POST /api/v1/auth/signup', () => {
    it('should not signup if payload has additional properties', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signup')
        .send({
          firstName,
          lastName,
          email,
          password,
          additional: ''
        })
        .end((error, response) => {
          assert.strictEqual(response.status, 422);
          assert.hasAllKeys(response.body, ['status', 'message']);
          done();
        });
    });

    it('should not signup if any required input is invalid', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signup')
        .send({
          firstName,
          lastName,
          email,
          password: emptyPassword
        })
        .end((error, response) => {
          assert.strictEqual(response.status, 422);
          assert.hasAllKeys(response.body, ['status', 'message']);
          done();
        });
    });

    it('should not signup if the email has already been used', (done) => {
      UsersDBQueries.createUser(firstName, lastName, email, password)
        .then(() => {
          chai.request(app)
            .post('/api/v1/auth/signup')
            .send({
              firstName,
              lastName,
              email,
              password
            })
            .end((error, response) => {
              assert.strictEqual(response.status, 422);
              assert.hasAllKeys(response.body, ['status', 'message']);
              done();
            });
        });
    });

    it('should signup', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signup')
        .send({
          firstName,
          lastName,
          email,
          password
        })
        .end((error, response) => {
          assert.strictEqual(response.status, 201);
          assert.hasAllKeys(response.body, ['status', 'message', 'data']);
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
      orderQueries
        .createNewOrder(recipientName, recipientAddress, recipientPhone, order);
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
    it('should not POST an order with no recipient name', (done) => {
      chai.request(app)
        .post('/api/v1/orders')
        .send({ recipientAddress, recipientPhone, order })
        .end((error, response) => {
          assert.strictEqual(response.status, 422);
          assert.hasAllKeys(response.body, ['status', 'message']);
          done();
        });
    });

    it('should not POST when recipient name is not a string', (done) => {
      chai.request(app)
        .post('/api/v1/orders')
        .send({
          recipientName: wrongRecipientName,
          recipientAddress,
          recipientPhone,
          order,
        })
        .end((error, response) => {
          assert.strictEqual(response.status, 422);
          assert.hasAllKeys(response.body, ['status', 'message']);
          done();
        });
    });

    it('should not POST when recipient name is an empty string', (done) => {
      chai.request(app)
        .post('/api/v1/orders')
        .send({
          recipientName: '    ',
          recipientAddress,
          recipientPhone,
          order,
        })
        .end((error, response) => {
          assert.strictEqual(response.status, 422);
          assert.hasAllKeys(response.body, ['status', 'message']);
          done();
        });
    });

    it('should not POST an order with no recipient address', (done) => {
      chai.request(app)
        .post('/api/v1/orders')
        .send({ recipientName, recipientPhone, order })
        .end((error, response) => {
          assert.strictEqual(response.status, 422);
          assert.hasAllKeys(response.body, ['status', 'message']);
          done();
        });
    });

    it('should not POST when recipient address is not a string', (done) => {
      chai.request(app)
        .post('/api/v1/orders')
        .send({
          recipientName,
          recipientPhone,
          recipientAddress: wrongRecipientAddress,
          order,
        })
        .end((error, response) => {
          assert.strictEqual(response.status, 422);
          assert.hasAllKeys(response.body, ['status', 'message']);
          done();
        });
    });

    it('should not POST recipient address is an empty string', (done) => {
      chai.request(app)
        .post('/api/v1/orders')
        .send({
          recipientName,
          recipientPhone,
          recipientAddress: '    ',
          order,
        })
        .end((error, response) => {
          assert.strictEqual(response.status, 422);
          assert.hasAllKeys(response.body, ['status', 'message']);
          done();
        });
    });

    it('should not POST an order with no recipient phone number', (done) => {
      chai.request(app)
        .post('/api/v1/orders')
        .send({
          recipientName,
          recipientAddress,
          order,
        })
        .end((error, response) => {
          assert.strictEqual(response.status, 422);
          assert.hasAllKeys(response.body, ['status', 'message']);
          done();
        });
    });

    it(
      'should not POST when recipient phone number is not a number',
      (done) => {
        chai.request(app)
          .post('/api/v1/orders')
          .send({
            recipientName,
            recipientPhone: wrongRecipientPhone,
            recipientAddress,
            order,
          })
          .end((error, response) => {
            assert.strictEqual(response.status, 422);
            assert.hasAllKeys(response.body, ['status', 'message']);
            done();
          });
      },
    );

    it('should not POST an order with no order property', (done) => {
      chai.request(app)
        .post('/api/v1/orders')
        .send({ recipientName, recipientAddress, recipientPhone })
        .end((error, response) => {
          assert.strictEqual(response.status, 422);
          assert.hasAllKeys(response.body, ['status', 'message']);
          done();
        });
    });

    it('should not POST an order when order is not an array', (done) => {
      chai.request(app)
        .post('/api/v1/orders')
        .send({
          recipientName,
          recipientAddress,
          recipientPhone,
          order: 'order',
        })
        .end((error, response) => {
          assert.strictEqual(response.status, 422);
          assert.hasAllKeys(response.body, ['status', 'message']);
          done();
        });
    });

    it('should not POST when the contents of order are not objects', (done) => {
      chai.request(app)
        .post('/api/v1/orders')
        .send({
          recipientName,
          recipientAddress,
          recipientPhone,
          order: [1],
        })
        .end((error, response) => {
          assert.strictEqual(response.status, 422);
          assert.hasAllKeys(response.body, ['status', 'message']);
          done();
        });
    });

    it(
      'should not POST when a content of order lacks a mealId property',
      (done) => {
        chai.request(app)
          .post('/api/v1/orders')
          .send({
            recipientName,
            recipientAddress,
            recipientPhone,
            order: orderNoMealId,
          })
          .end((error, response) => {
            assert.strictEqual(response.status, 422);
            assert.hasAllKeys(response.body, ['status', 'message']);
            done();
          });
      },
    );

    it('should not POST when the mealId is not a number', (done) => {
      chai.request(app)
        .post('/api/v1/orders')
        .send({
          recipientName,
          recipientAddress,
          recipientPhone,
          order: orderWrongMealId,
        })
        .end((error, response) => {
          assert.strictEqual(response.status, 422);
          assert.hasAllKeys(response.body, ['status', 'message']);
          done();
        });
    });

    it(
      'should not POST when the a content of order lacks a quantity property',
      (done) => {
        chai.request(app)
          .post('/api/v1/orders')
          .send({
            recipientName,
            recipientAddress,
            recipientPhone,
            order: orderNoquantity,
          })
          .end((error, response) => {
            assert.strictEqual(response.status, 422);
            assert.hasAllKeys(response.body, ['status', 'message']);
            done();
          });
      },
    );

    it('should not POST when quantity is not a number', (done) => {
      chai.request(app)
        .post('/api/v1/orders')
        .send({
          recipientName,
          recipientAddress,
          recipientPhone,
          order: orderWrongQuantity1,
        })
        .end((error, response) => {
          assert.strictEqual(response.status, 422);
          assert.hasAllKeys(response.body, ['status', 'message']);
          done();
        });
    });

    it('should not POST when quantity is less than one', (done) => {
      chai.request(app)
        .post('/api/v1/orders')
        .send({
          recipientName,
          recipientAddress,
          recipientPhone,
          order: orderWrongQuantity2,
        })
        .end((error, response) => {
          assert.strictEqual(response.status, 422);
          assert.hasAllKeys(response.body, ['status', 'message']);
          done();
        });
    });

    it('should POST an order', (done) => {
      chai.request(app)
        .post('/api/v1/orders')
        .send({
          recipientName,
          recipientAddress,
          recipientPhone,
          order,
        })
        .end((error, response) => {
          assert.strictEqual(response.status, 201);
          assert.hasAllKeys(response.body, ['status', 'message', 'data']);
          done();
        });
    });
  });

  describe('/GET /api/v1/orders/orderId', () => {
    it('should not GET an order when the orderId is not an integer', (done) => {
      orderQueries
        .createNewOrder(recipientName, recipientAddress, recipientPhone, order);
      chai.request(app)
        .get(`/api/v1/orders/${'*23ade'}`)
        .end((error, response) => {
          assert.strictEqual(response.status, 422);
          assert.hasAllKeys(response.body, ['status', 'message']);
          done();
        });
    });

    it('should not GET an order when the orderId does not exist', (done) => {
      orderQueries
        .createNewOrder(recipientName, recipientAddress, recipientPhone, order);
      chai.request(app)
        .get(`/api/v1/orders/${wrongOrderId}`)
        .end((error, response) => {
          assert.strictEqual(response.status, 404);
          assert.hasAllKeys(response.body, ['status', 'message']);
          done();
        });
    });

    it('should GET an order with the orderId', (done) => {
      const { orderId } = orderQueries
        .createNewOrder(recipientName, recipientAddress, recipientPhone, order);
      chai.request(app)
        .get(`/api/v1/orders/${orderId}`)
        .end((error, response) => {
          assert.strictEqual(response.status, 200);
          assert.hasAllKeys(response.body, ['status', 'message', 'data']);
          done();
        });
    });
  });

  describe('/PUT /api/v1/orders/orderId', () => {
    it('should not UPDATE when the orderId is not an integer', (done) => {
      orderQueries
        .createNewOrder(recipientName, recipientAddress, recipientPhone, order);
      chai.request(app)
        .put(`/api/v1/orders/${'*45'}`)
        .send({ status: orderStatus })
        .end((error, response) => {
          assert.strictEqual(response.status, 422);
          assert.hasAllKeys(response.body, ['status', 'message']);
          done();
        });
    });

    it('should not UPDATE when the orderId does not exist', (done) => {
      orderQueries
        .createNewOrder(recipientName, recipientAddress, recipientPhone, order);
      chai.request(app)
        .put(`/api/v1/orders/${wrongOrderId}`)
        .send({ status: orderStatus })
        .end((error, response) => {
          assert.strictEqual(response.status, 404);
          assert.hasAllKeys(response.body, ['status', 'message']);
          done();
        });
    });

    it('should not UPDATE if request body contains no status', (done) => {
      const { orderId } = orderQueries
        .createNewOrder(recipientName, recipientAddress, recipientPhone, order);
      chai.request(app)
        .put(`/api/v1/orders/${orderId}`)
        .end((error, response) => {
          assert.strictEqual(response.status, 422);
          assert.hasAllKeys(response.body, ['status', 'message']);
          done();
        });
    });

    it('should not UPDATE an order with an invalid status value', (done) => {
      const { orderId } = orderQueries
        .createNewOrder(recipientName, recipientAddress, recipientPhone, order);
      chai.request(app)
        .put(`/api/v1/orders/${orderId}`)
        .send({ status: wrongStatus })
        .end((error, response) => {
          assert.strictEqual(response.status, 422);
          assert.hasAllKeys(response.body, ['status', 'message']);
          done();
        });
    });

    it('should UPDATE an order status', (done) => {
      const { orderId } = orderQueries
        .createNewOrder(recipientName, recipientAddress, recipientPhone, order);
      chai.request(app)
        .put(`/api/v1/orders/${orderId}`)
        .send({ status: orderStatus })
        .end((error, response) => {
          assert.strictEqual(response.status, 200);
          assert.hasAllKeys(response.body, ['status', 'message', 'data']);
          done();
        });
    });
  });
});
