import { body, validationResult } from 'express-validator/check';
import { sanitizeBody } from 'express-validator/filter';

const checkErrors = (request, response, next) => {
  const errors = validationResult(request);

  if (!errors.isEmpty()) {
    const { status, message } = errors.array()[0].msg;
    const error = new Error(message);
    error.status = status;
    return next(error);
  }

  return next();
};

class Validator { }

Validator.validatePost = [
  body('recipientName')
    .exists().withMessage({ status: 422, message: 'Recipient name is required' })
    .isString()
    .withMessage({ status: 422, message: 'Recipient name should be a string' })
    .not()
    .isEmpty()
    .trim()
    .escape()
    .withMessage({ status: 422, message: 'Recipient name cannot be an empty' }),

  sanitizeBody('recipientName').trim().escape(),

  body('recipientAddress')
    .exists().withMessage({ status: 422, message: 'Recipient address is required' })
    .isString()
    .withMessage({ status: 422, message: 'Recipient address should be a string' })
    .not()
    .isEmpty()
    .trim()
    .escape()
    .withMessage({ status: 422, message: 'Recipient address cannot be an empty' }),

  sanitizeBody('recipientAddress').trim().escape(),

  body('recipientPhone')
    .exists().withMessage({ status: 422, message: 'Recipient phone number is required' })
    .isInt()
    .withMessage({ status: 422, message: 'Recipient phone number should be a number' }),

  sanitizeBody('recipientPhone').trim().escape(),

  body('order')
    .exists().withMessage({ status: 422, message: 'Order is required' })
    .isArray()
    .withMessage({ status: 422, message: 'Order must be an array' })
    .not()
    .isEmpty()
    .withMessage({ status: 422, message: 'Order content cannot be empty' })
    .custom((value) => {
      const type = Object.prototype.toString;
      const isAllObj = value.find(order => type.call(order) !== type.call({}));
      return isAllObj === undefined;
    })
    .withMessage({
      status: 422,
      message: 'Contents of order must be objects with properties: mealId and quantity',
    })
    .custom((value) => {
      const hasPropsMealId = value.find(order => order.mealId === undefined);
      return hasPropsMealId === undefined;
    })
    .withMessage({
      status: 422,
      message: 'contents of order must have property mealId',
    })
    .custom((value) => {
      const mealIdsAreNumber = value.find(order => typeof order.mealId !== 'number');
      return mealIdsAreNumber === undefined;
    })
    .withMessage({
      status: 422,
      message: 'mealId must be a number',
    })
    .custom((value) => {
      const hasPropsQuantity = value.find(order => order.quantity === undefined);
      return hasPropsQuantity === undefined;
    })
    .withMessage({
      status: 422,
      message: 'contents of order must have property quantity',
    })
    .custom((value) => {
      const mealIdAreNumber = value
        .find(order => (typeof order.quantity) !== 'number');
      return mealIdAreNumber === undefined;
    })
    .withMessage({
      status: 422,
      message: 'quantity must be a number',
    })
    .custom((value) => {
      const mealIdAreNumber = value
        .find(order => order.quantity < 1);
      return mealIdAreNumber === undefined;
    })
    .withMessage({
      status: 422,
      message: 'quantity must be greater than 0',
    }),

  sanitizeBody('order.*').trim().escape(),

  checkErrors,
];

export default Validator;
