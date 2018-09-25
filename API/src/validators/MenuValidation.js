import {
  doesPropertyExist,
  isString,
  isLetters,
  isPositiveInteger
} from './HelperValidators';

/**
 * Validates GET, POST menu operations
 */
class MenuValidation {
  /**
   * @static
   * @method validateMenuId
   * @description Validates request's payload
   * @param {object} request - HTTP request object
   * @param {object} response - HTTP response object
   * @param {Function} next - next middleware in the chain
   * @returns {Function} next middleware in the chain
   */
  static validateMenuId(request, response, next) {
    if (!isPositiveInteger(request.params.menuId)) {
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
   * @method validatePostMenu
   * @description Validates request's payload
   * @param {object} request - HTTP request object
   * @param {object} response - HTTP response object
   * @param {Function} next - next middleware in the chain
   * @returns {Function} next middleware in the chain
   */
  static validatePostMenu(request, response, next) {
    let {
      title, price, category, image
    } = request.body;

    if (Object.keys(request.body).length > 4) {
      const output = {
        status: 422,
        message: 'Unsuccessful. Payload contains additional properties'
      };
      response.status(422);
      return response.json(output);
    }

    title = (
      doesPropertyExist(title) && isString(title) && title.trim().length < 50
      && isLetters(title.trim()) && title.trim().toLowerCase()
    );
    price = (
      doesPropertyExist(price) && !Number.isNaN(Number(price))
      && Number(price)
    );
    category = (
      doesPropertyExist(category) && isString(category)
      && ['meal', 'drink', 'dessert'].includes(category.trim().toLowerCase())
      && category.trim().toLowerCase()
    );
    image = (
      doesPropertyExist(image) && isString(image) && image.trim()
    );

    if (!title || !price || !category || !image) {
      const output = {
        status: 422,
        message: 'Unsuccessful. Ensure required inputs are supplied and correct'
      };
      response.status(422);
      return response.json(output);
    }

    request.body.title = title;
    request.body.price = price;
    request.body.category = category;
    request.body.image = image;

    next();
  }
}

export default MenuValidation;
