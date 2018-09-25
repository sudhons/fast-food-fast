import chai, { assert } from 'chai';
import chaiHttp from 'chai-http';
import bcrypt from 'bcryptjs';

import app from '../src/app';
import orderQueries from '../src/queries/orderQueries';
import UsersDBQueries from '../src/queries/UsersDBQueries';
import MenuDBQueries from '../src/queries/MenuDBQueries';

chai.use(chaiHttp);

const firstName = 'Sunday';
const lastName = 'Sunday';
const email = 'sunday@ymail.com';
const wrongEmail = 'ade@gmail.com';
const password = 'Sunday12';
const adminEmail = 'fun@gamil.com';
const hashedPassword = bcrypt.hashSync('Sunday12', 10);
const wrongPassword = 'asdassd';
const emptyPassword = ' ';

const mealTitle = 'rice';
const mealPrice = 500;
const mealCategory = 'meal';
const mealImage = 'justimage';

let adminToken;
let customerToken;

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
    beforeEach((done) => {
      UsersDBQueries.deleteAllUsers();
      done();
    });

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
      UsersDBQueries.createUser(firstName, lastName, email, hashedPassword)
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

  describe('/POST /api/v1/auth/login', () => {
    beforeEach((done) => {
      UsersDBQueries.deleteAllUsers();
      done();
    });

    it('should not login if payload has additional properties', (done) => {
      UsersDBQueries.createUser(firstName, lastName, email, hashedPassword)
        .then(() => {
          chai.request(app)
            .post('/api/v1/auth/login')
            .send({
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
    });

    it('should not login if any required input is invalid', (done) => {
      UsersDBQueries.createUser(firstName, lastName, email, hashedPassword)
        .then(() => {
          chai.request(app)
            .post('/api/v1/auth/login')
            .send({
              email,
              password: emptyPassword
            })
            .end((error, response) => {
              assert.strictEqual(response.status, 422);
              assert.hasAllKeys(response.body, ['status', 'message']);
              done();
            });
        });
    });

    it('should not login with wrong email', (done) => {
      UsersDBQueries.createUser(firstName, lastName, email, hashedPassword)
        .then(() => {
          chai.request(app)
            .post('/api/v1/auth/login')
            .send({
              email: wrongEmail,
              password
            })
            .end((error, response) => {
              assert.strictEqual(response.status, 401);
              assert.hasAllKeys(response.body, ['status', 'message']);
              done();
            });
        });
    });

    it('should not login with wrong password', (done) => {
      UsersDBQueries.createUser(firstName, lastName, email, hashedPassword)
        .then(() => {
          chai.request(app)
            .post('/api/v1/auth/login')
            .send({
              email,
              password: wrongPassword
            })
            .end((error, response) => {
              assert.strictEqual(response.status, 401);
              assert.hasAllKeys(response.body, ['status', 'message']);
              done();
            });
        });
    });

    it('should login a customer', (done) => {
      UsersDBQueries.createUser(firstName, lastName, email, hashedPassword)
        .then(() => {
          chai.request(app)
            .post('/api/v1/auth/login')
            .send({
              email,
              password
            })
            .end((error, response) => {
              assert.strictEqual(response.status, 200);
              assert.hasAllKeys(response.body, ['status', 'message', 'data']);
              customerToken = response.body.data.token;
              done();
            });
        });
    });

    it('should login an admin', (done) => {
      UsersDBQueries
        .createAdmin(firstName, lastName, adminEmail, hashedPassword)
        .then(() => {
          chai.request(app)
            .post('/api/v1/auth/login')
            .send({
              email: adminEmail,
              password
            })
            .end((error, response) => {
              assert.strictEqual(response.status, 200);
              assert.hasAllKeys(response.body, ['status', 'message', 'data']);
              adminToken = response.body.data.token;
              done();
            });
        });
    });
  });

  describe('/GET /api/v1/menu', () => {
    it('should GET an array menu', (done) => {
      chai.request(app)
        .get('/api/v1/menu')
        .end((error, response) => {
          assert.strictEqual(response.status, 200);
          assert.hasAllKeys(response.body, ['status', 'message', 'data']);
          assert.isArray(response.body.data);
          done();
        });
    });
  });

  describe('/POST /api/v1/menu', () => {
    beforeEach((done) => {
      MenuDBQueries.deleteAllMeals();
      done();
    });

    it('should not POST without token', (done) => {
      chai.request(app)
        .post('/api/v1/menu')
        .send({
          title: mealTitle,
          price: mealPrice,
          category: mealCategory,
          image: mealImage
        })
        .end((error, response) => {
          assert.strictEqual(response.status, 401);
          assert.hasAllKeys(response.body, ['status', 'message']);
          assert.strictEqual(response.body.message, 'Token not supplied');
          done();
        });
    });

    it('should not POST with an invalid token', (done) => {
      chai.request(app)
        .post('/api/v1/menu')
        .set('x-access-token', 'dadajh')
        .send({
          title: mealTitle,
          price: mealPrice,
          category: mealCategory,
          image: mealImage
        })
        .end((error, response) => {
          assert.strictEqual(response.status, 401);
          assert.hasAllKeys(response.body, ['status', 'message']);
          assert.strictEqual(response.body.message, 'Invalid token');
          done();
        });
    });

    it('should not POST if not admin', (done) => {
      chai.request(app)
        .post('/api/v1/menu')
        .set('x-access-token', customerToken)
        .send({
          title: mealTitle,
          price: mealPrice,
          category: mealCategory,
          image: mealImage
        })
        .end((error, response) => {
          assert.strictEqual(response.status, 401);
          assert.hasAllKeys(response.body, ['status', 'message']);
          assert.strictEqual(response.body.message, 'Not authorized');
          done();
        });
    });

    it('should not POST if there are more inputs than required', (done) => {
      chai.request(app)
        .post('/api/v1/menu')
        .set('x-access-token', adminToken)
        .send({
          title: mealTitle,
          price: mealPrice,
          category: mealCategory,
          image: mealImage,
          moreProps: 'adad'
        })
        .end((error, response) => {
          assert.strictEqual(response.status, 422);
          assert.hasAllKeys(response.body, ['status', 'message']);
          assert.strictEqual(
            response.body.message,
            'Unsuccessful. Payload contains additional properties'
          );
          done();
        });
    });

    it('should not POST if any required value is missing', (done) => {
      chai.request(app)
        .post('/api/v1/menu')
        .set('x-access-token', adminToken)
        .send({
          title: mealTitle,
          price: mealPrice,
          category: mealCategory,
        })
        .end((error, response) => {
          assert.strictEqual(response.status, 422);
          assert.hasAllKeys(response.body, ['status', 'message']);
          assert.strictEqual(
            response.body.message,
            'Unsuccessful. Ensure required inputs are supplied and correct'
          );
          done();
        });
    });

    it('should not POST if meal title already exist', (done) => {
      MenuDBQueries.createMeal(mealTitle, mealPrice, mealCategory, mealImage);
      chai.request(app)
        .post('/api/v1/menu')
        .set('x-access-token', adminToken)
        .send({
          title: mealTitle,
          price: mealPrice,
          category: mealCategory,
          image: mealImage
        })
        .end((error, response) => {
          assert.strictEqual(response.status, 422);
          assert.hasAllKeys(response.body, ['status', 'message']);
          assert.strictEqual(
            response.body.message,
            'Meal with the title already exist'
          );
          done();
        });
    });

    it('should POST a new menu item', (done) => {
      chai.request(app)
        .post('/api/v1/menu')
        .set('x-access-token', adminToken)
        .send({
          title: mealTitle,
          price: mealPrice,
          category: mealCategory,
          image: mealImage
        })
        .end((error, response) => {
          assert.strictEqual(response.status, 201);
          assert.hasAllKeys(response.body, ['status', 'message', 'data']);
          done();
        });
    });
  });

  describe('/GET /api/v1/menu/:menuId', () => {
    beforeEach((done) => {
      MenuDBQueries.deleteAllMeals();
      done();
    });

    it('should not GET menu item when id is not an integer', (done) => {
      chai.request(app)
        .get('/api/v1/menu/4fdsd')
        .end((error, response) => {
          assert.strictEqual(response.status, 400);
          assert.hasAllKeys(response.body, ['status', 'message']);
          done();
        });
    });

    it('should not GET menu item when menu id does not exist', (done) => {
      chai.request(app)
        .get('/api/v1/menu/1000')
        .end((error, response) => {
          assert.strictEqual(response.status, 404);
          assert.hasAllKeys(response.body, ['status', 'message']);
          done();
        });
    });

    it('should GET menu item', (done) => {
      MenuDBQueries.createMeal(mealTitle, mealPrice, mealCategory, mealImage)
        .then((menu) => {
          chai.request(app)
            .get(`/api/v1/menu/${menu.menu_id}`)
            .end((error, response) => {
              assert.strictEqual(response.status, 200);
              assert.hasAllKeys(response.body, ['status', 'message', 'data']);
              done();
            });
        });
    });
  });

  describe('/GET /api/v1/orders', () => {
    beforeEach((done) => {
      orderQueries.deleteAllOrders();
      done();
    });

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
    beforeEach((done) => {
      orderQueries.deleteAllOrders();
      done();
    });

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
    beforeEach((done) => {
      orderQueries.deleteAllOrders();
      done();
    });

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
    beforeEach((done) => {
      orderQueries.deleteAllOrders();
      done();
    });

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
