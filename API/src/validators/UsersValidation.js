import {
  doesPropertyExist,
  isString,
  isLetters,
  isEmail,
  isPositiveInteger,
  isAlphaNumeric
} from './HelperValidators';

/**
 * Validate signup and signin
 */
class UsersValidation {
  /**
   * @static
   * @method validateUserId
   * @description Validates request's payload
   * @param {object} request - HTTP request object
   * @param {object} response - HTTP response object
   * @param {Function} next - next middleware in the chain
   * @returns {Function} next middleware in the chain
   */
  static validateUserId(request, response, next) {
    const { userId } = request.params;

    if (!isPositiveInteger(userId)) {
      response.status(400);
      return response.json({
        status: 400,
        message: 'Unsuccessful. Invalid params type'
      });
    }

    request.params.userId = Number(userId);

    return next();
  }

  /**
   * @static
   * @method validateSignup
   * @description Validates request's payload
   * @param {object} request - HTTP request object
   * @param {object} response - HTTP response object
   * @param {Function} next - next middleware in the chain
   * @returns {Function} next middleware in the chain
   */
  static validateSignup(request, response, next) {
    let {
      firstName, lastName, email, password
    } = request.body;

    if (Object.keys(request.body).length > 4) {
      response.status(422);
      return response.json({
        status: 422,
        message: 'Unsuccessful. Payload contains additional properties'
      });
    }

    firstName = (
      doesPropertyExist(firstName) && isString(firstName)
      && firstName.trim().length < 40 && isLetters(firstName.trim())
      && firstName.trim().toLowerCase()
    );

    if (!firstName) {
      response.status(422);
      return response.json({
        status: 422,
        message:
        'Unsuccessful. Letters only "firstName" (at most 40 characters) is required'
      });
    }

    lastName = (
      doesPropertyExist(lastName) && isString(lastName)
      && lastName.trim().length < 40 && isLetters(lastName.trim())
      && lastName.trim().toLowerCase()
    );

    if (!lastName) {
      response.status(422);
      return response.json({
        status: 422,
        message:
        'Unsuccessful. Letters only "lastName" (at most 40 characters) is required'
      });
    }

    email = (
      doesPropertyExist(email) && isString(email)
      && email.trim().length < 40 && isEmail(email.trim())
      && email.trim().toLowerCase()
    );

    if (!email) {
      response.status(422);
      return response.json({
        status: 422,
        message:
        'Unsuccessful. A valid "email" (at most 40 characters) is required'
      });
    }

    password = (
      doesPropertyExist(password) && isString(password)
      && password.trim().length < 40 && isAlphaNumeric(password.trim())
      && password.trim()
    );

    if (!password) {
      response.status(422);
      return response.json({
        status: 422,
        message:
        'Unsuccessful. An alphanumberic "password" (at most 40 characters) is required'
      });
    }

    request.body.firstName = firstName;
    request.body.lastName = lastName;
    request.body.email = email;
    request.body.password = password;

    next();
  }

  /**
 * @static
 * @method validateLogin
 * @description Validates request's payload
 * @param {object} request - HTTP request object
 * @param {object} response - HTTP response object
 * @param {Function} next - next middleware in the chain
 * @returns {Function} next middleware in the chain
 */
  static validateLogin(request, response, next) {
    let { email, password } = request.body;

    if (Object.keys(request.body).length > 2) {
      response.status(422);
      return response.json({
        status: 422,
        message: 'Unsuccessful. Payload contains additional properties'
      });
    }

    email = (
      doesPropertyExist(email) && isString(email)
      && email.trim().length < 40 && isEmail(email.trim())
      && email.trim().toLowerCase()
    );

    if (!email) {
      response.status(422);
      return response.json({
        status: 422,
        message:
        'Unsuccessful. A valid "email" (at most 40 characters) is required'
      });
    }

    password = (
      doesPropertyExist(password) && isString(password)
      && password.trim().length < 40 && isAlphaNumeric(password.trim())
      && password.trim()
    );

    if (!password) {
      response.status(422);
      return response.json({
        status: 422,
        message:
        'Unsuccessful An alphanumberic "password" (at most 40 characters) is required'
      });
    }

    request.body.email = email;
    request.body.password = password;

    next();
  }

  /**
   * @static
   * @method validateAdmin
   * @description Validates that it's an admin
   * @param {object} request - HTTP request object
   * @param {object} response - HTTP response object
   * @param {Function} next - next middleware in the chain
   * @returns {Function} next middleware in the chain
   */
  static validateAdmin(request, response, next) {
    if (request.userRole === 'admin') {
      return next();
    }

    response.status(403);
    return response.json({
      status: 403,
      message: 'Unsuccessful. Not authorized'
    });
  }

  /**
   * @static
   * @method validateUser
   * @description Validates that it's the user
   * @param {object} request - HTTP request object
   * @param {object} response - HTTP response object
   * @param {Function} next - next middleware in the chain
   * @returns {Function} next middleware in the chain
   */
  static validateUser(request, response, next) {
    const { userId } = request.params;
    if (request.userId === userId) {
      return next();
    }

    response.status(403);
    return response.json({
      status: 403,
      message: 'Unsuccessful. Not authorized'
    });
  }
}

export default UsersValidation;
