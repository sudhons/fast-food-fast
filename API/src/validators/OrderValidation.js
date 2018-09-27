import {
  doesPropertyExist,
  isString,
  isPositiveInteger,
  isObject,
} from './HelperValidators';

/**
 * Validates request object's load data
 */
class OrderValidation {
  /**
   * @static
   * @method validateOrderId
   * @description Validates request's payload
   * @param {object} request - HTTP request object
   * @param {object} response - HTTP response object
   * @param {Function} next - next middleware in the chain
   * @returns {Function} next middleware in the chain
   */
  static validateOrderId(request, response, next) {
    const { orderId } = request.params;

    if (!isPositiveInteger(orderId)) {
      response.status(400);
      return response.json({
        status: 400,
        message: 'Unsuccessful. Invalid params type'
      });
    }

    request.params.orderId = Number(orderId);

    return next();
  }

  /**
   * @static
   * @method validateOrder
   * @description Validates request's payload
   * @param {object} request - HTTP request object
   * @param {object} response - HTTP response object
   * @param {Function} next - next middleware in the chain
   * @returns {Function} next middleware in the chain
   */
  static validateOrder(request, response, next) {
    let { recipientName, recipientAddress } = request.body;

    const { recipientPhone, order } = request.body;

    if (Object.keys(request.body).length > 4) {
      response.status(422);
      return response.json({
        status: 422,
        message: 'Unsuccessful. Payload contains additional properties'
      });
    }

    recipientName = (
      doesPropertyExist(recipientName) && isString(recipientName)
      && recipientName.trim().length < 80
      && /^[A-Za-z ]+$/.test(recipientName.trim())
      && recipientName.trim().toLowerCase()
    );

    if (!recipientName) {
      response.status(422);
      return response.json({
        status: 422,
        message: 'Unsuccessful. Letters only "recipientName" (at most 80 characters) is required'
      });
    }

    recipientAddress = (
      doesPropertyExist(recipientAddress) && isString(recipientAddress)
      && /^[1-9][0-9]*[A-Za-z0-9,. ]+$/.test(recipientAddress.trim())
      && recipientAddress.trim().length < 120
      && recipientAddress.trim().toLowerCase()
    );

    if (!recipientAddress) {
      response.status(422);
      return response.json({
        status: 422,
        message:
          `Unsuccessful.
 A valid "recipientAddress" (at most 120 characters) is required`
      });
    }

    if (!doesPropertyExist(recipientPhone) ||
      !isPositiveInteger(recipientPhone)) {
      response.status(422);
      return response.json({
        status: 422,
        message: 'Unsuccessful. A valid "RecipientPhone" number is required'
      });
    }

    if (!doesPropertyExist(order) || !Array.isArray(order) ||
      order.length === 0) {
      response.status(422);
      return response.json({
        status: 422,
        message: 'Unsuccessful. A non-empty "order" of type array is required'
      });
    }

    const nonObjectOrderContent = order.find(value => !isObject(value));
    if (nonObjectOrderContent !== undefined) {
      response.status(422);
      return response.json({
        status: 422,
        message: 'Unsuccessful. Contents of "order" must be objects'
      });
    }

    const orderContentWithoutIntegerMealId = order
      .find(value => !doesPropertyExist(value.mealId) ||
        !isPositiveInteger(value.mealId));
    if (orderContentWithoutIntegerMealId !== undefined) {
      response.status(422);
      return response.json({
        status: 422,
        message: 'Unsuccessful. Contents of "order" must have positive integer property "mealId"'
      });
    }

    const orderContentWithoutIntegerQuantity = order
      .find(value => !doesPropertyExist(value.quantity) ||
        !isPositiveInteger(value.quantity));
    if (orderContentWithoutIntegerQuantity !== undefined) {
      response.status(422);
      return response.json({
        status: 422,
        message: 'Unsuccessful. Contents of "order" must have positive integer property "quantity"'
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

    const isValidStatus = !doesPropertyExist(status) && !isString(status)
      && ['new', 'processing', 'cancelled', 'completed']
        .includes(status.trim().toLowerCase());

    if (!isValidStatus) {
      response.status(422);
      return response.json({
        status: 422,
        message: 'Unsuccessful. A "status" value ("new", "processing", "cancelled", "completed") is required'
      });
    }

    request.body.status = status.trim().toLowerCase();

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

    if (status.trim().length === 0) {
      response.status(422);
      return response.json({
        status: 422,
        message: 'Status cannot be empty string'
      });
    }

    const isValidStatus = ['new', 'processing', 'cancelled', 'completed']
      .includes(status.trim().toLowerCase());

    if (!isValidStatus) {
      response.status(422);
      return response.json({
        status: 422,
        message: 'Invalid status value'
      });
    }

    request.body.status = status.trim().toLowerCase();

    return next();
  }
}

export default OrderValidation;
