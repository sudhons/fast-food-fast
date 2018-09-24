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
        response.status(201);
        return response
          .json({
            status: 201,
            message: 'Successful',
            data: { userId: newUser.user_id, role: newUser.user_role }
          });
      })
      .catch(() => {
        response.status(422);
        return response
          .json({ status: 422, message: 'Email already in use' });
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
        .then((isMatch) => {
          if (!isMatch) return Promise.reject();

          jwt.sign(
            { user },
            process.env.JWT_KEY,
            { expiresIn: '2h' },
            (error, token) => {
              response.status(200);
              return response
                .json({
                  status: 200,
                  message: 'Successful',
                  data: { token, userId: user.user_id, role: user.user_role }
                });
            }
          );
        }))
      .catch(() => {
        response.status(401);
        return response
          .json({ status: 401, message: 'Invalid credentials' });
      });
  }
}

export default UsersController;
