import OrderDBQueries from '../queries/OrderDBQueries';
import MenuDBQueries from '../queries/MenuDBQueries';
import SalesDBQueries from '../queries/SalesDBQueries';

/**
 * Performs GET, POST and UPDATE operations on orders
 */
class OrderDBController {
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

    const { userId } = request;

    for (let count = 0; count < order.length; count += 1) {
      MenuDBQueries.getMealById(order[count].mealId)
        .then(meal => (meal
          ? Promise.resolve(meal)
          : Promise.reject()))
        .then((meal) => {
          order[count].title = meal.title;
          order[count].price = Number(meal.price);
          order[count].total = order[count].quantity * Number(meal.price);
          if (count === order.length - 1) {
            const totalAmount = order
              .reduce((prev, value) => prev + value.total, 0);

            OrderDBQueries
              .createNewOrder(
                userId,
                recipientName,
                recipientAddress,
                recipientPhone,
                order,
                totalAmount
              )
              .then((newOrder) => {
                newOrder.cart = [];
                order.forEach(value => SalesDBQueries
                  .createSale(
                    newOrder.order_id,
                    value.title,
                    value.price,
                    value.quantity,
                    value.total
                  )
                  .then((sale) => {
                    const {
                      title, quantity, unit_price, total
                    } = sale;
                    newOrder.cart.push({
                      title, unit_price, quantity, total
                    });
                    if (order.indexOf(value) === order.length - 1) {
                      response.status(201);
                      return response.json({
                        status: 201,
                        message: 'Order Successfully placed',
                        data: newOrder
                      });
                    }
                  }));
              });
          }
        })
        .catch(() => {
          count = 99999999;
          response.status(404);
          return response
            .json({ status: 404, message: 'Menu does not exist' });
        });
    }
  }

  /**
   * @static
   * @method getAnOrders
   * @description Fetches an order by its id
   * @param {object} request - HTTP Request Object
   * @param {object} response - HTTP Response object
   * @returns {object} status, message and order data
   */
  static getAnOrder(request, response) {
    const orderId = Number(request.params.orderId);

    OrderDBQueries.getAnOrderById(orderId)
      .then(order => (!order ? Promise.reject() : Promise.resolve(order)))
      .then((order) => {
        order.cart = [];
        SalesDBQueries.getSalesByOrderId(orderId)
          .then((sales) => {
            sales.forEach((value) => {
              const {
                title, quantity, unit_price, total
              } = value;
              order.cart.push({
                title, unit_price, quantity, total
              });
              if (sales.indexOf(value) === sales.length - 1) {
                response.status(200);
                return response
                  .json({ status: 200, message: 'Successful', data: order });
              }
            });
          });
      })
      .catch(() => {
        response.status(404);
        return response.json({
          status: 404,
          message: 'Unsuccessful. Order not Found'
        });
      });
  }

  /**
   * @static
   * @method getAllOrders
   * @description Fetches an order by its id
   * @param {object} request - HTTP Request Object
   * @param {object} response - HTTP Response object
   * @returns {object} status, message and order data
   */
  static getAllOrders(request, response) {
    OrderDBQueries.getAllOrders()
      .then(result => (result.length
        ? Promise.resolve(result)
        : Promise.reject()))
      .then((result) => {
        for (let count = 0; count < result.length; count += 1) {
          result[count].cart = [];
          SalesDBQueries
            .getSalesByOrderId(result[count].order_id)
            .then((sales) => {
              sales.forEach((value) => {
                const {
                  title, quantity, unit_price, total
                } = value;
                result[count].cart.push({
                  title, unit_price, quantity, total
                });
                if (count === result.length - 1 &&
                  sales.indexOf(value) === sales.length - 1) {
                  response.status(200);
                  return response.json({
                    status: 200,
                    message: 'Successful',
                    data: result
                  });
                }
              });
            });
        }
      })
      .catch(() => {
        response.status(200);
        return response
          .json({ status: 200, message: 'Successful', data: [] });
      });
  }

  /**
   * @static
   * @method getAUserOrders
   * @description Fetches an order by its id
   * @param {object} request - HTTP Request Object
   * @param {object} response - HTTP Response object
   * @returns {object} status, message and order data
   */
  static getAUserOrders(request, response) {
    const userId = Number(request.params.userId);

    OrderDBQueries.getOrdersByUserId(userId)
      .then(result => (result.length
        ? Promise.resolve(result)
        : Promise.reject()))
      .then((result) => {
        for (let count = 0; count < result.length; count += 1) {
          result[count].cart = [];
          SalesDBQueries
            .getSalesByOrderId(result[count].order_id)
            .then((sales) => {
              sales.forEach((value) => {
                const {
                  title, quantity, unit_price, total
                } = value;
                result[count].cart.push({
                  title, unit_price, quantity, total
                });
                if (count === result.length - 1 &&
                  sales.indexOf(value) === sales.length - 1) {
                  response.status(200);
                  return response.json({
                    status: 200,
                    message: 'Successful',
                    data: result
                  });
                }
              });
            });
        }
      })
      .catch(() => {
        response.status(200);
        return response
          .json({ status: 200, message: 'Successful', data: [] });
      });
  }

  /**
   * @static
   * @method updateOrderStatus
   * @description Uptates an order status
   * @param {object} request - HTTP Request object
   * @param {object} response - HTTP Response object
   * @returns {object} status, message and order data
   */
  static updateOrderStatus(request, response) {
    const { status } = request.body;
    const orderId = Number(request.params.orderId);

    OrderDBQueries.updateAnOrderById(orderId, status)
      .then(result => (!result ? Promise.reject() : Promise.resolve(result)))
      .then(result => SalesDBQueries.updateSalesByOrderId(orderId, status)
        .then((sales) => {
          result.cart = [];
          sales.forEach((value) => {
            const {
              title, quantity, unit_price, total
            } = value;
            result.cart.push({
              title, unit_price, quantity, total
            });

            if (sales.indexOf(value) === sales.length - 1) {
              response.status(200);
              return response.json({
                status: 200,
                message: 'Successful. Status updated',
                data: result
              });
            }
          });
        }))
      .catch(() => {
        response.status(404);
        return response
          .json({ status: 404, message: 'Unsuccessful. Order not Found' });
      });
  }
}

export default OrderDBController;
