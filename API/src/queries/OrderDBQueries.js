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

    return dbConnect.query(query).then((result => result.rows[0]));
  }
}

export default OrderDBQueries;
