import orderData from '../db/dbData';

/**
 * queries data
 */
class Data {
  /**
   * @constructs
   * @description constructs a new Data
   * @param {string} customer - customer name
   * @param {string} recipientName - recipient name
   * @param {string} recipientAddr - recipient address
   * @param {number} recipientPhone - recipient phone number
   * @param {array} order - an array of meal
   */
  constructor(customer, recipientName, recipientAddr, recipientPhone, order) {
    Data.count = Data.count ? Data.count + 1 : 1;

    this.orderId = Data.count;
    this.customer = customer;
    this.recipientName = recipientName;
    this.recipientAddress = recipientAddr;
    this.recipientPhone = recipientPhone;
    this.order = order;
    this.orderTime = Date.now();
    this.status = 'waiting';
  }

  /**
   * @static
   * @method createNewOrder
   * @description creates a new order
   * @param {string} recipientName - the recipient name
   * @param {string} recipientAddr - the recipient address
   * @param {number} recipientPhone - the recipient phone number
   * @param {array} order - an array of meal
   * @returns {object} the new order
   */
  static createNewOrder(recipientName, recipientAddr, recipientPhone, order) {
    const customer = 'Adeolu James';
    const unitPrice = 200;
    order.forEach((value) => {
      const mealOrder = value;
      mealOrder.unitPrice = unitPrice;
      mealOrder.total = value.quantity * unitPrice;
    });
    const newOrder = new Data(
      customer,
      recipientName,
      recipientAddr,
      recipientPhone,
      order
    );
    orderData.push(newOrder);

    return newOrder;
  }

  /**
   * @static
   * @method getAllOrders
   * @description Fetches all the orders
   * @returns {Array} an array of all orders
   */
  static getAllOrders() {
    return orderData;
  }

  /**
   * @static
   * @method getAnOrder
   * @description Fetches an order by its id
   * @param {integer} orderId - the order's ID
   * @returns {object} an order or null if order id does not exist
   */
  static getAnOrder(orderId) {
    const requiredOrder = orderData.find(order => order.orderId === orderId);
    return requiredOrder || null;
  }

  /**
   * @static
   * @method getAnOrder
   * @description updates the status of an order
   * @param {integer} orderId - the order's ID
   * @param {string} status - the new status
   * @returns {object} the updated order
   */
  static updateOrderStatus(orderId, status) {
    const requiredOrder = Data.getAnOrder(orderId);

    requiredOrder.status = status;

    if (status !== 'waiting') {
      requiredOrder[`${status}Time`] = Date.now();
    }

    switch (status) {
      case 'accepted':
        requiredOrder.declinedTime = null;
        requiredOrder.completedTime = null;
        break;
      case 'declined':
        requiredOrder.acceptedTime = null;
        requiredOrder.completedTime = null;
        break;
      case 'completed':
        break;
      default:
        requiredOrder.acceptedTime = null;
        requiredOrder.declinedTime = null;
        requiredOrder.completedTime = null;
    }

    return requiredOrder;
  }

  /**
   * @static
   * @method deleteAllOrders
   * @description delete all orders
   * @returns {undefined} undefined
   */
  static deleteAllOrders() {
    orderData.length = 0;
  }
}

export default Data;
