import {
  doesPropertyExist,
  isString,
  isPositiveInteger,
  isObject,
  isLetters
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
    if (!isPositiveInteger(request.params.orderId)) {
      response.status(400);
      return response.json({
        status: 400,
        message: 'Invalid params type'
      });
    }

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

    recipientName = (
      doesPropertyExist(recipientName) && isString(recipientName)
      && recipientName.trim().length < 100 && isLetters(recipientName.trim())
      && recipientName.trim().toLowerCase()
    );

    if (!recipientName) {
      response.status(422);
      return response.json({
        status: 422,
        message: 'Unsuccessful. Ensure recipient name is supplied and correct'
      });
    }

    recipientAddress = (
      doesPropertyExist(recipientAddress) && isString(recipientAddress)
      && recipientAddress.trim().length < 200
      && recipientAddress.trim().toLowerCase()
    );

    if (!recipientAddress) {
      response.status(422);
      return response.json({
        status: 422,
        message:
          'Unsuccessful. Ensure recipient address is supplied and correct'
      });
    }

    if (!doesPropertyExist(recipientPhone)) {
      response.status(422);
      return response.json({
        status: 422,
        message: 'Recipient phone number is required'
      });
    }

    if (!isPositiveInteger(recipientPhone)) {
      response.status(422);
      return response.json({
        status: 422,
        message: 'Enter a valid Recipient phone number'
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

    const mealIdsAreNumber = order
      .find(value => !isPositiveInteger(value.mealId));
    if (mealIdsAreNumber !== undefined) {
      response.status(422);
      return response.json({
        status: 422,
        message: 'MealId must be a number'
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

    const quantitiesArePositiveNumbers = order
      .find(value => !isPositiveInteger(value.quantity));
    if (quantitiesArePositiveNumbers !== undefined) {
      response.status(422);
      return response.json({
        status: 422,
        message: 'Quantity must be a positive number'
      });
    }

    return next();
  }
}

export default OrderValidation;
