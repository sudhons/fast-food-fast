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

    let doesAllMealExist = true;

    const done = () => {
      if (!doesAllMealExist) {
        response.status(404);
        return response
          .json({ status: 404, message: 'Menu does not exist' });
      }

      const totalAmount = order.reduce((prev, value) => prev + value.total, 0);

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
          order.forEach(value => SalesDBQueries
            .createSale(
              newOrder.order_id,
              value.title,
              value.price,
              value.quantity,
              value.total
            ));
        })
        .then(() => {
          response.status(201);
          return response
            .json({
              status: 201,
              message: 'Order Successfully placed',
            });
        });
    };

    for (let count = 0; count < order.length; count += 1) {
      MenuDBQueries.getMealById(order[count].mealId)
        .then(meal => (meal
          ? Promise.resolve(meal)
          : Promise.reject()))
        .then((meal) => {
          order[count].title = meal.title;
          order[count].price = Number(meal.price);
          order[count].total = order[count].quantity * Number(meal.price);
          if (count === order.length - 1) done();
        })
        .catch(() => {
          count = 99999999;
          doesAllMealExist = false;
          done();
        });
    }
  }
}

export default OrderDBController;
