import {
  doesPropertyExist,
  isString,
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
    const { menuId } = request.params;
    if (!isPositiveInteger(menuId)) {
      response.status(400);
      return response.json({
        status: 400,
        message: 'Unsuccessful. Invalid params type'
      });
    }

    request.params.menuId = Number(menuId);

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
      response.status(422);
      return response.json({
        status: 422,
        message: 'Unsuccessful. Payload contains additional properties'
      });
    }

    title = (
      doesPropertyExist(title) && isString(title) && title.trim().length < 50
      && /^[A-Za-z ]+$/.test(title.trim()) && title.trim().toLowerCase()
    );

    if (!title) {
      response.status(422);
      return response.json({
        status: 422,
        message:
        'Unsuccessful. Letters only "title" (at most 50 characters) is required'
      });
    }

    price = (
      doesPropertyExist(price) && !Number.isNaN(Number(price))
      && /^[0-9]+\.?[0-9]{0,2}$/.test(price) && Number(price)
    );

    if (!price) {
      response.status(422);
      return response.json({
        status: 422,
        message: 'Unsuccessful. A valid "price" (type number) is required'
      });
    }

    category = (
      doesPropertyExist(category) && isString(category)
      && ['meal', 'drink', 'dessert'].includes(category.trim().toLowerCase())
      && category.trim().toLowerCase()
    );

    if (!category) {
      response.status(422);
      return response.json({
        status: 422,
        message:
        'Unsuccessful. A "category" value ("meal", "drink", "dessert", "completed") is required'
      });
    }

    image = (
      doesPropertyExist(image) && isString(image) && image.trim()
    );

    if (!image) {
      response.status(422);
      return response.json({
        status: 422,
        message: 'Unsuccessful. A valid "image" link is required'
      });
    }

    request.body.title = title;
    request.body.price = price;
    request.body.category = category;
    request.body.image = image;

    next();
  }
}

export default MenuValidation;
