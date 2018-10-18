import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import UsersDBQueries from '../queries/UsersDBQueries';

/**
 * Performs GET, POST operations on users
 */
class UsersController {
  /**
   * @static
   * @method signup
   * @description Posts a new user
   * @param {object} request - HTTP Request object
   * @param {object} response - HTTP Response object
   * @returns {object} status, message
   */
  static signup(request, response) {
    const {
      firstName,
      lastName,
      email,
      password
    } = request.body;

    UsersDBQueries.getUserByEmail(email)
      .then(user => (user ? Promise.reject() : bcrypt.hash(password, 10)))
      .then(hash => UsersDBQueries.createUser(firstName, lastName, email, hash))
      .then((newUser) => {
        jwt.sign(
          { userId: newUser.user_id, userRole: newUser.user_role },
          process.env.JWT_KEY,
          (error, token) => {
            response.status(201);
            return response
              .json({
                status: 201,
                message: 'Successfully signed up',
                data: { token, userId: newUser.user_id }
              });
          }
        );
      })
      .catch(() => {
        response.status(409);
        return response
          .json({ status: 409, message: 'Unsuccessful. Email already in use' });
      });
  }

  /**
   * @static
   * @method login
   * @description Posts a new user
   * @param {object} request - HTTP Request object
   * @param {object} response - HTTP Response object
   * @returns {object} status, message
   */
  static login(request, response) {
    const {
      email,
      password
    } = request.body;

    UsersDBQueries.getUserByEmail(email)
      .then(user => (!user ? Promise.reject() : Promise.resolve(user)))
      .then(user => bcrypt.compare(password, user.password)
        .then(isMatch => (!isMatch ? Promise.reject() : Promise.resolve()))
        .then(() => {
          jwt.sign(
            { userId: user.user_id, userRole: user.user_role },
            process.env.JWT_KEY,
            (error, token) => {
              response.status(200);
              return response
                .json({
                  status: 200,
                  message: 'Successfully logged in',
                  data: { token, userId: user.user_id }
                });
            }
          );
        }))
      .catch(() => {
        response.status(401);
        return response
          .json({ status: 401, message: 'Unsuccessful. Invalid credentials' });
      });
  }
}

export default UsersController;
