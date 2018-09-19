import Data from '../queries/orderQueries';

/**
 * Performs GET, POST and UPDATE operations on orders
 */
class Order {
  /**
   * @static
   * @method getAllOrders
   * @description Fetches all the orders
   * @param {object} request - HTTP request object
   * @param {object} response - HTTP response object
   * @returns {object} status, message and order data
   */
  static getAllOrders(request, response) {
    const data = Data.getAllOrders();

    response.status(200);
    return response.json({ status: 200, message: 'Successful', data });
  }

  /**
   * @static
   * @method postOrder
   * @description Posts a new order
   * @param {object} request - HTTP Request object
   * @param {object} response - HTTP Response object
   * @returns {object} status, message and order data
   */
  static postOrder(request, response) {
    const {
      recipientName,
      recipientAddress,
      recipientPhone,
      order,
    } = request.body;

    const data = Data
      .createNewOrder(recipientName, recipientAddress, recipientPhone, order);

    response.status(201);
    return response.json({ status: 201, message: 'Successful', data });
  }

  /**
   * @static
   * @method getOrder
   * @description Fetches an order by its id
   * @param {object} request - HTTP Request Object
   * @param {object} response - HTTP Response object
   * @returns {object} status, message and order data
   */
  static getOrder(request, response) {
    const data = Data.getAnOrder(Number(request.params.orderId));

    response.status(200);
    return response.json({ status: 200, message: 'Sucessful', data });
  }

  /**
   * @static
   * @description Updates an order's status
   * @param {object} request - HTTP Request Object
   * @param {object} response - HTTP Response object
   * @returns {object} status, message and order data
   */
  static updateOrder(request, response) {
    const data = Data
      .updateOrderStatus(
        Number(request.params.orderId),
        request.body.status.toLowerCase()
      );
    response.status(200);
    return response
      .json({ status: 200, message: 'Status successfully updated', data });
  }
}

export default Order;
