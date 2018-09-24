import bcrypt from 'bcryptjs';

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
          .json({ status: 201, message: 'Successful', data: newUser });
      })
      .catch(() => {
        response.status(422);
        return response
          .json({ status: 422, message: 'Email already in use' });
      });
  }
}

export default UsersController;
