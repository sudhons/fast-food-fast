import chai, { assert } from 'chai';
import chaiHttp from 'chai-http';
import bcrypt from 'bcryptjs';

import app from '../src/app';
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
          assert.strictEqual(
            response.body.message,
            'Unsuccessful. An alphanumberic "password" (at most 40 characters) is required'
          );
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
          assert.hasAllKeys(response.body, ['status', 'message', 'token']);
          assert.strictEqual(
            response.body.message,
            'Successfully signed up'
          );
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
              assert.strictEqual(
                response.body.message,
                'Unsuccessful. Payload contains additional properties'
              );
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
              assert.strictEqual(
                response.body.message,
                'Unsuccessful An alphanumberic "password" (at most 40 characters) is required'
              );
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
              assert.strictEqual(
                response.body.message,
                'Unsuccessful. Invalid credentials'
              );
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
              assert.strictEqual(
                response.body.message,
                'Unsuccessful. Invalid credentials'
              );
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
              assert.hasAllKeys(response.body, ['status', 'message', 'token']);
              assert.strictEqual(
                response.body.message,
                'Successfully logged in',
              );
              customerToken = response.body.token;
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
              assert.hasAllKeys(response.body, ['status', 'message', 'token']);
              assert.strictEqual(
                response.body.message,
                'Successfully logged in',
              );
              adminToken = response.body.token;
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
          assert.strictEqual(response.status, 403);
          assert.hasAllKeys(response.body, ['status', 'message']);
          assert.strictEqual(response.body.message, 'Unsuccessful. Authentication failed');
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
              assert.strictEqual(
                response.body.message,
                'Sucessful',
              );
              done();
            });
        });
    });
  });
});
