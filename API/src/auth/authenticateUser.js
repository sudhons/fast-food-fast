import jwt from 'jsonwebtoken';

/**
 * @function authenticateUser
 * @description authenticate a user
 * @param {object} request - HTTP request object
 * @param {object} response - HTTP response object
 * @param {Function} next - next middleware in the chain
 * @returns {Function} next middleware in the chain
 */
const authenticateUser = (request, response, next) => {
  const token = request.headers.authorization ||
    request.headers['x-access-token'];

  if (!token) {
    const output = { status: 401, message: 'Token not supplied' };
    response.status(401);
    return response.json(output);
  }

  jwt.verify(token, process.env.JWT_KEY, (error, decoded) => {
    if (error) {
      const output = { status: 401, message: 'Invalid token' };
      return response.status(401).json(output);
    }

    request.userId = decoded.userId;
    request.userRole = decoded.userRole;

    return next();
  });
};

export default authenticateUser;
