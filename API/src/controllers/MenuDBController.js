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
}

export default MenuDBController;
