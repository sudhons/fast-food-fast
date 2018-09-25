const doesPropertyExist = property => property !== undefined;

const isString = property => typeof property === 'string';

const isLetters = property => /^[A-Za-z]+$/.test(property);

const isEmail = property => /^\w+@\w+\.\w+$/.test(property);

// passord must be alphanumeric
const isValidPassword = property => /^\w+$/.test(property);


/**
 * Performs GET, POST operations on users
 */
class UsersValidation {
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
      const output = {
        status: 422,
        message: 'Unsuccessful. Payload contains additional properties'
      };
      response.status(422);
      return response.json(output);
    }

    firstName = (
      doesPropertyExist(firstName) && isString(firstName)
      && isLetters(firstName.trim()) && firstName.trim().toLowerCase()
    );
    lastName = (
      doesPropertyExist(lastName) && isString(lastName)
      && isLetters(lastName.trim()) && lastName.trim().toLowerCase()
    );
    email = (
      doesPropertyExist(email) && isString(email)
      && isEmail(email.trim()) && email.trim().toLowerCase()
    );
    password = (
      doesPropertyExist(password) && isString(password)
      && isValidPassword(password.trim()) && password.trim()
    );

    if (!firstName || !lastName || !email || !password) {
      const output = {
        status: 422,
        message: 'Unsuccessful. Ensure required inputs are supplied and correct'
      };
      response.status(422);
      return response.json(output);
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
      const output = {
        status: 422,
        message: 'Unsuccessful. Payload contains additional properties'
      };
      response.status(422);
      return response.json(output);
    }

    email = (
      doesPropertyExist(email) && isString(email)
      && isEmail(email.trim()) && email.trim().toLowerCase()
    );
    password = (
      doesPropertyExist(password) && isString(password)
      && isValidPassword(password.trim()) && password.trim()
    );

    if (!email || !password) {
      const output = {
        status: 422,
        message: 'Unsuccessful. Ensure required inputs are supplied and correct'
      };
      response.status(422);
      return response.json(output);
    }

    request.body.email = email;
    request.body.password = password;

    next();
  }
}

export default UsersValidation;
