import Data from '../queries/orderQueries';

class Order {
  static getAllOrders(request, response) {
    const data = Data.getAllOrders();

    response.status(200);
    return response.json({ status: 200, message: 'Successful', data });
  }

  static postOrder(request, response) {
    const {
      recipientName,
      recipientAddress,
      recipientPhone,
      order,
    } = request.body;
    const data = Data
      .createNewOrder(recipientName, recipientAddress, recipientPhone, order);

    return response.status(201).json({ status: 201, message: 'Successful', data });
  }
}

export default Order;
