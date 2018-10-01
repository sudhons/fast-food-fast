import chai, { assert } from 'chai';
import chaiHttp from 'chai-http';
import bcrypt from 'bcryptjs';

import app from '../src/app';
import UsersDBQueries from '../src/queries/UsersDBQueries';
import MenuDBQueries from '../src/queries/MenuDBQueries';
import OrderDBQueries from '../src/queries/OrderDBQueries';

chai.use(chaiHttp);

const firstName = 'Sunday';
const lastName = 'Sunday';
const email = 'sunday@ymail.com';
const wrongEmail = 'ade@gmail.com';
const password = 'Sunday12';
const adminEmail = 'fun@gamil.com';
const hashedPassword = bcrypt.hashSync('Sunday12', 10);
const wrongPassword = 'asdassd';
const emptyPassword = '  ';

const mealTitle = 'rice';
const mealPrice = 500;
const mealCategory = 'meal';
const mealImage = 'justimage';

let adminToken;
let customerToken;
let customerId;
let adminId;
let orderId;

const recipientName = 'John Doe';
const recipientPhone = 9009054321;
const recipientAddress = '32 Araomi Onike Yaba';
const order = [{ mealId: 2, quantity: 2 }];
const orderWrongMealId = [{ mealId: -3, quantity: 2 }];
const orderMoreThanRequiredProps = [{ mealId: 10000000, quantity: 2, fun: '' }];
const orderNotExistingMealId = [{ mealId: 10000000, quantity: 2 }];
const orderWrongQuantity = [{ mealId: 90, quantity: 0 }];
const wrongOrderId = 39237;
const orderStatus = 'CanCelled';
const wrongStatus = 'wrong status';

describe('App', () => {
  describe('/GET /', () => {
    it('should return a 404 error', (done) => {
      chai.request(app)
        .get('/')
        .end((error, response) => {
          assert.strictEqual(response.status, 404);
          assert.hasAllKeys(response.body, ['status', 'message']);
          assert.strictEqual(response.body.message, 'unknown url path');
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
          assert
            .strictEqual(response.body.message, 'Welcome to fast food fast');
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
          assert.strictEqual(
            response.body.message,
            'Unsuccessful. Payload contains additional properties'
          );
          done();
        });
    });

    it('should not signup with invalid first name', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signup')
        .send({
          firstName: '435435',
          lastName,
          email,
          password,
        })
        .end((error, response) => {
          assert.strictEqual(response.status, 422);
          assert.hasAllKeys(response.body, ['status', 'message']);
          assert.strictEqual(
            response.body.message,
            'Unsuccessful. Letters only "firstName" (at most 40 characters) is required'
          );
          done();
        });
    });

    it('should not signup with invalid last name', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signup')
        .send({
          firstName,
          lastName: '435435',
          email,
          password,
        })
        .end((error, response) => {
          assert.strictEqual(response.status, 422);
          assert.hasAllKeys(response.body, ['status', 'message']);
          assert.strictEqual(
            response.body.message,
            'Unsuccessful. Letters only "lastName" (at most 40 characters) is required'
          );
          done();
        });
    });

    it('should not signup with invalid email', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signup')
        .send({
          firstName,
          lastName,
          email: 'adefadf',
          password,
        })
        .end((error, response) => {
          assert.strictEqual(response.status, 422);
          assert.hasAllKeys(response.body, ['status', 'message']);
          assert.strictEqual(
            response.body.message,
            'Unsuccessful. A valid "email" (at most 40 characters) is required'
          );
          done();
        });
    });

    it('should not signup with invalid password', (done) => {
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
          assert.strictEqual(
            response.body.message,
            'Unsuccessful. An alphanumberic "password" (at most 40 characters) is required'
          );
          done();
        });
    });

    it('should not signup if email is already in use', (done) => {
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
              assert.strictEqual(response.status, 409);
              assert.hasAllKeys(response.body, ['status', 'message']);
              assert.strictEqual(
                response.body.message,
                'Unsuccessful. Email already in use'
              );
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
          assert.hasAnyDeepKeys(
            response.body,
            ['status', 'message', 'data', 'token', 'userId']
          );
          assert.strictEqual(
            response.body.message,
            'Successfully signed up'
          );
          done();
        });
    });
  });

  describe('/POST /api/v1/auth/login', () => {
    it('should not login if payload has additional properties', (done) => {
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
          assert.strictEqual(
            response.body.message,
            'Unsuccessful. Payload contains additional properties'
          );
          done();
        });
    });

    it('should not login with invalid email', (done) => {
      chai.request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'adefadf',
          password,
        })
        .end((error, response) => {
          assert.strictEqual(response.status, 422);
          assert.hasAllKeys(response.body, ['status', 'message']);
          assert.strictEqual(
            response.body.message,
            'Unsuccessful. A valid "email" (at most 40 characters) is required'
          );
          done();
        });
    });

    it('should not login with invalid password', (done) => {
      chai.request(app)
        .post('/api/v1/auth/login')
        .send({
          email,
          password: emptyPassword
        })
        .end((error, response) => {
          assert.strictEqual(response.status, 422);
          assert.hasAllKeys(response.body, ['status', 'message']);
          assert.strictEqual(
            response.body.message,
            'Unsuccessful An alphanumberic "password" (at most 40 characters) is required'
          );
          done();
        });
    });

    it('should not login with wrong email', (done) => {
      chai.request(app)
        .post('/api/v1/auth/login')
        .send({
          email: wrongEmail,
          password
        })
        .end((error, response) => {
          assert.strictEqual(response.status, 401);
          assert.hasAllKeys(response.body, ['status', 'message']);
          assert.strictEqual(
            response.body.message,
            'Unsuccessful. Invalid credentials'
          );
          done();
        });
    });

    it('should not login with wrong password', (done) => {
      chai.request(app)
        .post('/api/v1/auth/login')
        .send({
          email,
          password: wrongPassword
        })
        .end((error, response) => {
          assert.strictEqual(response.status, 401);
          assert.hasAllKeys(response.body, ['status', 'message']);
          assert.strictEqual(
            response.body.message,
            'Unsuccessful. Invalid credentials'
          );
          done();
        });
    });

    it('should login a customer', (done) => {
      chai.request(app)
        .post('/api/v1/auth/login')
        .send({
          email,
          password
        })
        .end((error, response) => {
          assert.strictEqual(response.status, 200);
          assert.hasAnyDeepKeys(
            response.body,
            ['status', 'message', 'data', 'token', 'userId']
          );
          assert.strictEqual(
            response.body.message,
            'Successfully logged in',
          );
          customerToken = response.body.data.token;
          customerId = response.body.data.userId;
          done();
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
              assert.hasAnyDeepKeys(
                response.body,
                ['status', 'message', 'data', 'token', 'userId']
              );
              assert.strictEqual(
                response.body.message,
                'Successfully logged in',
              );
              adminToken = response.body.data.token;
              adminId = response.body.data.userId;
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
          assert.strictEqual(
            response.body.message,
            'Successful',
          );
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
        .set('authorization', 'dadajh')
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
          assert.strictEqual(response.status, 403);
          assert.hasAllKeys(response.body, ['status', 'message']);
          assert.strictEqual(response.body.message, 'Unsuccessful. Not authorized');
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

    it('should not POST with an invalid title', (done) => {
      chai.request(app)
        .post('/api/v1/menu')
        .set('x-access-token', adminToken)
        .send({
          title: '     ',
          price: mealPrice,
          category: mealCategory,
          image: mealImage
        })
        .end((error, response) => {
          assert.strictEqual(response.status, 422);
          assert.hasAllKeys(response.body, ['status', 'message']);
          assert.strictEqual(
            response.body.message,
            'Unsuccessful. Letters only "title" (at most 50 characters) is required'
          );
          done();
        });
    });

    it('should not POST with an invalid price', (done) => {
      chai.request(app)
        .post('/api/v1/menu')
        .set('x-access-token', adminToken)
        .send({
          title: mealTitle,
          price: 'ff545',
          category: mealCategory,
          image: mealImage
        })
        .end((error, response) => {
          assert.strictEqual(response.status, 422);
          assert.hasAllKeys(response.body, ['status', 'message']);
          assert.strictEqual(
            response.body.message,
            'Unsuccessful. A valid "price" (type number) is required'
          );
          done();
        });
    });

    it('should not POST with an invalid category', (done) => {
      chai.request(app)
        .post('/api/v1/menu')
        .set('x-access-token', adminToken)
        .send({
          title: mealTitle,
          price: mealPrice,
          category: 'enjoy',
          image: mealImage
        })
        .end((error, response) => {
          assert.strictEqual(response.status, 422);
          assert.hasAllKeys(response.body, ['status', 'message']);
          assert.strictEqual(
            response.body.message,
            'Unsuccessful. A "category" value ("meal", "drink", "dessert", "completed") is required'
          );
          done();
        });
    });

    it('should not POST with an invalid image params type', (done) => {
      chai.request(app)
        .post('/api/v1/menu')
        .set('x-access-token', adminToken)
        .send({
          title: mealTitle,
          price: mealPrice,
          category: mealCategory,
          image: 455453
        })
        .end((error, response) => {
          assert.strictEqual(response.status, 422);
          assert.hasAllKeys(response.body, ['status', 'message']);
          assert.strictEqual(
            response.body.message,
            'Unsuccessful. A valid "image" link is required'
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
          assert.strictEqual(response.status, 409);
          assert.hasAllKeys(response.body, ['status', 'message']);
          assert.strictEqual(
            response.body.message,
            'Meal with the "title" already exist'
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
          assert.strictEqual(
            response.body.message,
            'Successfully created a menu item',
          );
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
          assert.strictEqual(
            response.body.message,
            'Unsuccessful. Invalid params type'
          );
          done();
        });
    });

    it('should not GET menu item when menu id does not exist', (done) => {
      chai.request(app)
        .get('/api/v1/menu/1000')
        .end((error, response) => {
          assert.strictEqual(response.status, 404);
          assert.hasAllKeys(response.body, ['status', 'message']);
          assert.strictEqual(
            response.body.message,
            'Menu item not Found',
          );
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
              assert.isObject(response.body.data);
              assert.strictEqual(
                response.body.message,
                'Sucessful',
              );
              done();
            });
        });
    });
  });

  describe('/POST /api/v1/orders', () => {
    beforeEach((done) => {
      OrderDBQueries.deleteAllOrders();
      MenuDBQueries.deleteAllMeals();
      done();
    });

    it('should not POST if payload has more than required inputs', (done) => {
      chai.request(app)
        .post('/api/v1/orders')
        .set('x-access-token', customerToken)
        .send({
          recipientName,
          recipientAddress,
          recipientPhone,
          order,
          add: ''
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

    it('should not POST an order with invalid recipient name', (done) => {
      chai.request(app)
        .post('/api/v1/orders')
        .set('x-access-token', customerToken)
        .send({
          recipientName: 32,
          recipientAddress,
          recipientPhone,
          order,
        })
        .end((error, response) => {
          assert.strictEqual(response.status, 422);
          assert.hasAllKeys(response.body, ['status', 'message']);
          assert.strictEqual(response.body.message, 'Unsuccessful. Letters only "recipientName" (at most 80 characters) is required');
          done();
        });
    });

    it('should not POST an order with invalid recipient address', (done) => {
      chai.request(app)
        .post('/api/v1/orders')
        .set('x-access-token', customerToken)
        .send({
          recipientName,
          recipientAddress: '[]',
          recipientPhone,
          order,
        })
        .end((error, response) => {
          assert.strictEqual(response.status, 422);
          assert.hasAllKeys(response.body, ['status', 'message']);
          assert.strictEqual(response.body.message, 'Unsuccessful. A valid "recipientAddress" (at most 120 characters) is required');
          done();
        });
    });

    it('should not POST an order with invalid recipient phone number', (done) => {
      chai.request(app)
        .post('/api/v1/orders')
        .set('x-access-token', customerToken)
        .send({
          recipientName,
          recipientAddress,
          recipientPhone: -1,
          order,
        })
        .end((error, response) => {
          assert.strictEqual(response.status, 422);
          assert.hasAllKeys(response.body, ['status', 'message']);
          assert.strictEqual(response.body.message, 'Unsuccessful. A valid "RecipientPhone" number is required');
          done();
        });
    });

    it('should not POST if order is non array or empty array', (done) => {
      chai.request(app)
        .post('/api/v1/orders')
        .set('x-access-token', customerToken)
        .send({
          recipientName,
          recipientAddress,
          recipientPhone,
          order: [],
        })
        .end((error, response) => {
          assert.strictEqual(response.status, 422);
          assert.hasAllKeys(response.body, ['status', 'message']);
          assert.strictEqual(response.body.message, 'Unsuccessful. A non-empty "order" of type array is required');
          done();
        });
    });

    it('should not POST if order is non array or empty array', (done) => {
      chai.request(app)
        .post('/api/v1/orders')
        .set('x-access-token', customerToken)
        .send({
          recipientName,
          recipientAddress,
          recipientPhone,
          order: [],
        })
        .end((error, response) => {
          assert.strictEqual(response.status, 422);
          assert.hasAllKeys(response.body, ['status', 'message']);
          assert.strictEqual(response.body.message, 'Unsuccessful. A non-empty "order" of type array is required');
          done();
        });
    });

    it('should not POST if order contents are not objects', (done) => {
      chai.request(app)
        .post('/api/v1/orders')
        .set('x-access-token', customerToken)
        .send({
          recipientName,
          recipientAddress,
          recipientPhone,
          order: [4],
        })
        .end((error, response) => {
          assert.strictEqual(response.status, 422);
          assert.hasAllKeys(response.body, ['status', 'message']);
          assert.strictEqual(response.body.message, 'Unsuccessful. Contents of "order" must be objects');
          done();
        });
    });

    it('should not POST if any order contents has more than required properties', (done) => {
      chai.request(app)
        .post('/api/v1/orders')
        .set('x-access-token', customerToken)
        .send({
          recipientName,
          recipientAddress,
          recipientPhone,
          order: orderMoreThanRequiredProps,
        })
        .end((error, response) => {
          assert.strictEqual(response.status, 422);
          assert.hasAllKeys(response.body, ['status', 'message']);
          assert.strictEqual(
            response.body.message,
            'Unsuccessful. Contents of "order" should have properties "mealId" and "quantity only'
          );
          done();
        });
    });

    it('should not POST if any order contents have invalid mealId', (done) => {
      chai.request(app)
        .post('/api/v1/orders')
        .set('x-access-token', customerToken)
        .send({
          recipientName,
          recipientAddress,
          recipientPhone,
          order: orderWrongMealId,
        })
        .end((error, response) => {
          assert.strictEqual(response.status, 422);
          assert.hasAllKeys(response.body, ['status', 'message']);
          assert.strictEqual(
            response.body.message,
            'Unsuccessful. Contents of "order" must have positive integer property "mealId"'
          );
          done();
        });
    });

    it('should not POST if any order contents have invalid quantity', (done) => {
      chai.request(app)
        .post('/api/v1/orders')
        .set('x-access-token', customerToken)
        .send({
          recipientName,
          recipientAddress,
          recipientPhone,
          order: orderWrongQuantity
        })
        .end((error, response) => {
          assert.strictEqual(response.status, 422);
          assert.hasAllKeys(response.body, ['status', 'message']);
          assert.strictEqual(
            response.body.message,
            'Unsuccessful. Contents of "order" must have positive integer property "quantity"'
          );
          done();
        });
    });

    it('should not POST if there order with a meal Id that does not exit', (done) => {
      chai.request(app)
        .post('/api/v1/orders')
        .set('x-access-token', customerToken)
        .send({
          recipientName,
          recipientAddress,
          recipientPhone,
          order: orderNotExistingMealId,
        })
        .end((error, response) => {
          assert.strictEqual(response.status, 404);
          assert.hasAllKeys(response.body, ['status', 'message']);
          assert.strictEqual(
            response.body.message,
            'Menu does not exist'
          );
          done();
        });
    });

    it('should POST an order', (done) => {
      MenuDBQueries.createMeal(mealTitle, mealPrice, mealCategory, mealImage)
        .then((menu) => {
          chai.request(app)
            .post('/api/v1/orders')
            .set('x-access-token', customerToken)
            .send({
              recipientName,
              recipientAddress,
              recipientPhone,
              order: [{ mealId: menu.menu_id, quantity: 4 }]
            })
            .end((error, response) => {
              assert.strictEqual(response.status, 201);
              assert.hasAllKeys(response.body, ['status', 'message', 'data']);
              assert.strictEqual(response.body.message, 'Order Successfully placed');
              orderId = response.body.data.order_id;
              done();
            });
        });
    });
  });

  describe('/GET /api/v1/orders/:orderId', () => {
    it('should not GET an order when the orderId is not an integer', (done) => {
      chai.request(app)
        .get(`/api/v1/orders/${'*23ade'}`)
        .set('x-access-token', adminToken)
        .end((error, response) => {
          assert.strictEqual(response.status, 400);
          assert.hasAllKeys(response.body, ['status', 'message']);
          assert.strictEqual(response.body.message, 'Unsuccessful. Invalid params type');
          done();
        });
    });

    it('should not GET an order when the orderId does not exist', (done) => {
      chai.request(app)
        .get(`/api/v1/orders/${wrongOrderId}`)
        .set('x-access-token', adminToken)
        .end((error, response) => {
          assert.strictEqual(response.status, 404);
          assert.hasAllKeys(response.body, ['status', 'message']);
          assert.strictEqual(response.body.message, 'Unsuccessful. Order not Found');
          done();
        });
    });

    it('should GET an order with the orderId', (done) => {
      chai.request(app)
        .get(`/api/v1/orders/${orderId}`)
        .set('x-access-token', adminToken)
        .end((error, response) => {
          assert.strictEqual(response.status, 200);
          assert.hasAllKeys(response.body, ['status', 'message', 'data']);
          assert.strictEqual(response.body.message, 'Successful');
          done();
        });
    });
  });

  describe('/PUT /api/v1/orders/:orderId', () => {
    it('should not UPDATE an order if payload has additional properties', (done) => {
      chai.request(app)
        .put(`/api/v1/orders/${orderId}`)
        .set('x-access-token', adminToken)
        .send({ status: orderStatus, add: ' ' })
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

    it('should not UPDATE an order with an invalid status value', (done) => {
      chai.request(app)
        .put(`/api/v1/orders/${orderId}`)
        .set('x-access-token', adminToken)
        .send({ status: wrongStatus })
        .end((error, response) => {
          assert.strictEqual(response.status, 422);
          assert.hasAllKeys(response.body, ['status', 'message']);
          assert.strictEqual(
            response.body.message,
            'Unsuccessful. A "status" value ("new", "processing", "cancelled", "completed") is required'
          );
          done();
        });
    });

    it('should not GET an order when the orderId does not exist', (done) => {
      chai.request(app)
        .put(`/api/v1/orders/${wrongOrderId}`)
        .set('x-access-token', adminToken)
        .send({ status: orderStatus })
        .end((error, response) => {
          assert.strictEqual(response.status, 404);
          assert.hasAllKeys(response.body, ['status', 'message']);
          assert.strictEqual(response.body.message, 'Unsuccessful. Order not Found');
          done();
        });
    });

    it('should UPDATE an order status', (done) => {
      chai.request(app)
        .put(`/api/v1/orders/${orderId}`)
        .set('x-access-token', adminToken)
        .send({ status: orderStatus })
        .end((error, response) => {
          assert.strictEqual(response.status, 200);
          assert.hasAllKeys(response.body, ['status', 'message', 'data']);
          assert.strictEqual(response.body.message, 'Successful. Status updated');
          done();
        });
    });
  });

  describe('/GET /api/v1/users/:userId/orders', () => {
    it('should not GET orders when the userId is not an integer', (done) => {
      chai.request(app)
        .get(`/api/v1/users/${'*23ade'}/orders`)
        .set('x-access-token', customerToken)
        .end((error, response) => {
          assert.strictEqual(response.status, 400);
          assert.hasAllKeys(response.body, ['status', 'message']);
          assert.strictEqual(response.body.message, 'Unsuccessful. Invalid params type');
          done();
        });
    });

    it('should not GET orders if not user\'s', (done) => {
      chai.request(app)
        .get(`/api/v1/users/${adminId}/orders`)
        .set('x-access-token', customerToken)
        .end((error, response) => {
          assert.strictEqual(response.status, 403);
          assert.hasAllKeys(response.body, ['status', 'message']);
          assert.strictEqual(response.body.message, 'Unsuccessful. Not authorized');
          done();
        });
    });

    it('should GET should get an empty array if user has no order', (done) => {
      chai.request(app)
        .get(`/api/v1/users/${adminId}/orders`)
        .set('x-access-token', adminToken)
        .end((error, response) => {
          assert.strictEqual(response.status, 200);
          assert.hasAllKeys(response.body, ['status', 'message', 'data']);
          assert.strictEqual(response.body.message, 'Successful');
          assert.isEmpty(response.body.data);
          done();
        });
    });

    it('should GET a user\'s orders', (done) => {
      chai.request(app)
        .get(`/api/v1/users/${customerId}/orders`)
        .set('x-access-token', customerToken)
        .end((error, response) => {
          assert.strictEqual(response.status, 200);
          assert.hasAllKeys(response.body, ['status', 'message', 'data']);
          assert.strictEqual(response.body.message, 'Successful');
          done();
        });
    });
  });

  describe('/GET /api/v1/orders', () => {
    it('should GET an array of orders', (done) => {
      chai.request(app)
        .get('/api/v1/orders')
        .set('x-access-token', adminToken)
        .end((error, response) => {
          assert.strictEqual(response.status, 200);
          assert.hasAllKeys(response.body, ['status', 'message', 'data']);
          assert.strictEqual(response.body.message, 'Successful');
          assert.isArray(response.body.data);
          orderId = response.body.data[0].order_id;
          done();
        });
    });

    it('should GET an empty array if there are no orders', (done) => {
      OrderDBQueries.deleteAllOrders();
      chai.request(app)
        .get('/api/v1/orders')
        .set('x-access-token', adminToken)
        .end((error, response) => {
          assert.strictEqual(response.status, 200);
          assert.hasAllKeys(response.body, ['status', 'message', 'data']);
          assert.strictEqual(response.body.message, 'Successful');
          assert.isArray(response.body.data);
          assert.isEmpty(response.body.data);
          done();
        });
    });
  });
});
