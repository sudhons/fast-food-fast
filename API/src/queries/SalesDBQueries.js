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
   * @method getSalesByOrderId
   * @description get sales
   * @param {integer} orderId - the order Id
   * @returns {object} the new sales
   */
  static getSalesByOrderId(orderId) {
    const query = `SELECT * FROM sales WHERE order_id=${orderId}`;

    return dbConnect.query(query).then(result => result.rows);
  }

  /**
   * @static
   * @method updateSalesById
   * @param {integer} orderId - the order id
   * @param {string} status - the new status
   * @description Fetches an the order
   * @returns {Array} an array of all orders
   */
  static updateSalesByOrderId(orderId, status) {
    const query = `UPDATE sales SET sales_status='${status}'
    WHERE order_id=${orderId} RETURNING *`;

    return dbConnect.query(query).then(result => result.rows[0]);
  }
}

export default SalesDBQueries;
