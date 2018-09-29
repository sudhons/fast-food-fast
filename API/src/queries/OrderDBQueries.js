import dbConnect from '../config/dbConnect';

/**
 * queries data
 */
class OrderDBQueries {
  /**
   * @static
   * @method createNewOrder
   * @description creates a new order
   * @param {integer} userId - the user Id
   * @param {string} recipientName - the recipient name
   * @param {string} recipientAddress - the recipient address
   * @param {number} recipientPhone - the recipient phone number
   * @param {array} order - an array of meal
   * @param {number} totalAmount - the total amount for the goods
   * @returns {object} the new order
   */
  static createNewOrder(
    userId,
    recipientName,
    recipientAddress,
    recipientPhone,
    order,
    totalAmount
  ) {
    const query = `INSERT INTO orders
    (user_id, recipient_name, recipient_address, recipient_phone, total_amount)
    VALUES (${userId}, '${recipientName}',
    '${recipientAddress}', '${recipientPhone}', ${totalAmount}) RETURNING *`;

    return dbConnect.query(query).then(result => result.rows[0]);
  }

  /**
   * @static
   * @method getAllOrders
   * @description Fetches all the orders
   * @returns {Array} an array of all orders
   */
  static getAllOrders() {
    const query = 'SELECT * FROM orders';
    return dbConnect.query(query).then(result => result.rows);
  }

  /**
   * @static
   * @method getOrdersByUserId
   * @param {integer} userId - the user Id
   * @description Fetches all orders by a user
   * @returns {Array} an array of all orders
   */
  static getOrdersByUserId(userId) {
    const query = `SELECT * FROM orders WHERE user_id=${userId}`;
    return dbConnect.query(query).then(result => result.rows);
  }

  /**
   * @static
   * @method getAnOrder
   * @param {integer} orderId - the order id
   * @description Fetches an the order
   * @returns {Array} an array of all orders
   */
  static getAnOrderById(orderId) {
    const query = `SELECT * FROM orders WHERE order_id=${orderId}`;
    return dbConnect.query(query).then(result => result.rows[0]);
  }

  /**
   * @static
   * @method updateAnOrderById
   * @param {integer} orderId - the order id
   * @param {string} status - the new status
   * @description Fetches an the order
   * @returns {Array} an array of all orders
   */
  static updateAnOrderById(orderId, status) {
    const query = `UPDATE orders SET order_status='${status}'
    WHERE order_id=${orderId} RETURNING *`;
    return dbConnect.query(query).then(result => result.rows[0]);
  }

  /**
   * @static
   * @method deleteAllOrders
   * @description delete all orders
   * @returns {undefined} undefined
   */
  static deleteAllOrders() {
    const query = 'DELETE FROM orders';
    dbConnect.query(query);
  }
}

export default OrderDBQueries;
