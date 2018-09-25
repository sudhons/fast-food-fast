import MenuDBQueries from '../queries/MenuDBQueries';

/**
 * Performs GET, POST operations on Meals
 */
class MenuDBController {
  /**
   * @static
   * @method getAllMeals
   * @description Fetches all the meals
   * @param {object} request - HTTP request object
   * @param {object} response - HTTP response object
   * @returns {object} status, message and meal data
   */
  static getAllMeals(request, response) {
    MenuDBQueries.getAllMeals()
      .then((menu) => {
        response.status(200);
        return response
          .json({ status: 200, message: 'Successful', data: menu });
      });
  }

  /**
   * @static
   * @method getAMeal
   * @description Fetches an order by its id
   * @param {object} request - HTTP Request Object
   * @param {object} response - HTTP Response object
   * @returns {object} status, message and order data
   */
  static getAMeal(request, response) {
    MenuDBQueries.getMealById(Number(request.params.menuId))
      .then(meal => (!meal ? Promise.reject() : Promise.resolve(meal)))
      .then((meal) => {
        response.status(200);
        return response.json({ status: 200, message: 'Sucessful', data: meal });
      })
      .catch(() => {
        response.status(404);
        return response.json({ status: 404, message: 'Menu item not Found' });
      });
  }
}

export default MenuDBController;
