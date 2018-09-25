import dbConnect from '../config/dbConnect';

/**
 * queries data
 */
class MenuDBQueries {
  /**
   * @static
   * @method createMeal
   * @description creates a new meal
   * @param {string} title - meal title
   * @param {number} price - meal price
   * @param {string} category - meal category
   * @param {string} image - image link
   * @returns {object} the new meal
   */
  static createMeal(title, price, category, image) {
    const query = `INSERT INTO menu (title, price, category, image)
    VALUES ('${title}', '${price}', '${category}', '${image}')
    RETURNING *`;

    return dbConnect.query(query).then(data => data.rows[0]);
  }

  /**
   * @static
   * @method getAllMeals
   * @description Fetches all the meals
   * @returns {Array} an array of all meals
   */
  static getAllMeals() {
    const query = 'SELECT * FROM menu';

    return dbConnect.query(query).then(data => data.rows);
  }

  /**
   * @static
   * @method getMealById
   * @description Fetches an meal by its id
   * @param {integer} mealId - the meal's ID
   * @returns {object} a meal or null if meal id does not exist
   */
  static getMealById(mealId) {
    const query = `SELECT * FROM menu WHERE menu_id='${mealId}'`;

    return dbConnect.query(query).then(data => data.rows[0]);
  }

  /**
   * @static
   * @method getMealByTitle
   * @description Fetches an meal by its title
   * @param {string} title - the meal's title
   * @returns {object} a meal or null if meal id does not exist
   */
  static getMealByTitle(title) {
    const query = `SELECT * FROM menu WHERE title='${title}'`;

    return dbConnect.query(query).then(data => data.rows[0]);
  }

  /**
   * @static
   * @method deleteAllMeals
   * @description delete all meals
   * @returns {undefined} undefined
   */
  static deleteAllMeals() {
    const query = 'DELETE FROM menu';
    dbConnect.query(query);
  }
}

export default MenuDBQueries;
