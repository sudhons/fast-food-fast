import Data from '../queries/orderQueries';

class Order {
  static getAllOrders(request, response) {
    const data = Data.getAllOrders();

    response.status(200);
    return response.json({ status: 200, message: 'Successful', data });
  }
}

export default Order;
