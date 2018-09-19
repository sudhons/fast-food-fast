import Data from '../queries/orderQueries';

const doesPropertyExist = property => property !== undefined;

const isString = property => typeof property === 'string';

const isNotEmptyString = property => property.length > 0;

const isNumber = (property) => {
  const props = Number(property);
  return !Number.isNaN(props) && props > 0;
};

const isObject = (property) => {
  const type = Object.prototype.toString;
  return type.call(property) === type.call({});
};

/**
 * Validates request object's load data
 */
class Validator {
  /**
   * @static
   * @method validatePost
   * @description Validates request's payload
   * @param {object} request - HTTP request object
   * @param {object} response - HTTP response object
   * @param {Function} next - next middleware in the chain
   * @returns {Function} next middleware in the chain
   */
  static validatePost(request, response, next) {
    const {
      recipientName, recipientAddress, recipientPhone, order
    } = request.body;

    if (!doesPropertyExist(recipientName)) {
      response.status(422);
      return response.json({
        status: 422,
        message: 'Recipient name is required'
      });
    }

    if (!isString(recipientName)) {
      response.status(422);
      return response.json({
        status: 422,
        message: 'Recipient name should be a string'
      });
    }

    if (!isNotEmptyString(recipientName.trim())) {
      response.status(422);
      return response.json({
        status: 422,
        message: 'Recipient name cannot be an empty string'
      });
    }

    if (!doesPropertyExist(recipientAddress)) {
      response.status(422);
      return response.json({
        status: 422,
        message: 'Recipient address is required'
      });
    }

    if (!isString(recipientAddress)) {
      response.status(422);
      return response.json({
        status: 422,
        message: 'Recipient address should be a string'
      });
    }

    if (!isNotEmptyString(recipientAddress.trim())) {
      response.status(422);
      return response.json({
        status: 422,
        message: 'Recipient address cannot be an empty string'
      });
    }

    if (!doesPropertyExist(recipientPhone)) {
      response.status(422);
      return response.json({
        status: 422,
        message: 'Recipient phone number is required'
      });
    }

    if (!isNumber(recipientPhone)) {
      response.status(422);
      return response.json({
        status: 422,
        message: 'Invalid Recipient phone number value'
      });
    }

    if (!doesPropertyExist(order)) {
      response.status(422);
      return response.json({
        status: 422,
        message: 'Order is required'
      });
    }

    if (!Array.isArray(order)) {
      response.status(422);
      return response.json({
        status: 422,
        message: 'Order must be an array'
      });
    }

    if (order.length === 0) {
      response.status(422);
      return response.json({
        status: 422,
        message: 'Order content cannot be empty'
      });
    }

    const isAllObj = order.find(value => !isObject(value));
    if (isAllObj !== undefined) {
      response.status(422);
      return response.json({
        status: 422,
        message: 'Contents of order must be objects'
      });
    }

    const hasPropsMealId = order
      .find(value => !doesPropertyExist(value.mealId));
    if (hasPropsMealId !== undefined) {
      response.status(422);
      return response.json({
        status: 422,
        message: 'Contents of order must have property mealId'
      });
    }

    const ordersWithInvalidMealId = order
      .find(value => !isNumber(value.mealId));
    if (ordersWithInvalidMealId !== undefined) {
      response.status(422);
      return response.json({
        status: 422,
        message: 'Invalid MealId value'
      });
    }

    const hasPropsQuantity = order
      .find(value => !doesPropertyExist(value.quantity));
    if (hasPropsQuantity !== undefined) {
      response.status(422);
      return response.json({
        status: 422,
        message: 'Contents of order must have property quantity'
      });
    }

    const ordersWithInvalidQuantity = order
      .find(value => !isNumber(value.quantity));
    if (ordersWithInvalidQuantity !== undefined) {
      response.status(422);
      return response.json({
        status: 422,
        message: 'Invalid Quantity value'
      });
    }

    request.body.recipientName = recipientName.trim();
    request.body.recipientAddress = recipientAddress.trim();
    request.body.recipientPhone = Number(recipientPhone);
    request.body.order.forEach((value) => {
      value.mealId = Number(value.mealId);
      value.quantity = Number(value.quantity);
    });

    return next();
  }

  /**
   * @static
   * @method validateOrderId
   * @description Validates order's Id
   * @param {object} request - HTTP request object
   * @param {object} response - HTTP response object
   * @param {Function} next - next middleware in the chain
   * @returns {Function} next middleware in the chain
   */
  static validateOrderId(request, response, next) {
    const orderId = Number(request.params.orderId);
    if (Number.isNaN(orderId)) {
      response.status(422);
      return response.json({
        status: 422,
        message: 'Order Id must be an integer'
      });
    }

    const order = Data.getAnOrder(orderId);
    if (order === null) {
      response.status(404);
      return response.json({
        status: 404,
        message: 'Order Id must be an integer'
      });
    }

    return next();
  }

  /**
   * @static
   * @method validateStatus
   * @description Validates request's status value
   * @param {object} request - HTTP request object
   * @param {object} response - HTTP response object
   * @param {Function} next - next middleware in the chain
   * @returns {Function} next middleware in the chain
   */
  static validateStatus(request, response, next) {
    const { status } = request.body;

    if (!doesPropertyExist(status)) {
      response.status(422);
      return response.json({
        status: 422,
        message: 'Status is required'
      });
    }

    if (!isString(status)) {
      response.status(422);
      return response.json({
        status: 422,
        message: 'Status should be string valued'
      });
    }

    if (!isNotEmptyString(status.trim())) {
      response.status(422);
      return response.json({
        status: 422,
        message: 'Status cannot be empty string'
      });
    }

    const isValidStatus = ['waiting', 'accepted', 'declined', 'completed']
      .includes(status.trim().toLowerCase());

    if (!isValidStatus) {
      response.status(422);
      return response.json({
        status: 422,
        message: 'Invalid status value'
      });
    }

    return next();
  }
}

export default Validator;
