import dbConnect from '../config/dbConnect';

/**
 * queries data
 */
class SalesDBQueries {
  /**
   * @static
   * @method createSale
   * @description creates a new sales
   * @param {integer} orderId - the order Id
   * @param {string} title - the meal title
   * @param {number} price - the price
   * @param {integer} quantity - the quantity
   * @param {number} total - the total price
   * @returns {object} the new sales
   */
  static createSale(orderId, title, price, quantity, total) {
    const query = `INSERT INTO sales
    (order_id, title, unit_price, quantity, total)
    VALUES (${orderId}, '${title}', ${price}, ${quantity}, ${total})
    RETURNING *`;

    return dbConnect.query(query).then(sale => sale.rows[0]);
  }

  /**
   * @static
   * @method createSale
   * @description get sales
   * @param {integer} orderId - the order Id
   * @returns {object} the new sales
   */
  static getSalesByOrderId(orderId) {
    const query = `SELECT * FROM sales WHERE order_id=${orderId}`;

    return dbConnect.query(query).then(result => result.rows);
  }
}

export default SalesDBQueries;
