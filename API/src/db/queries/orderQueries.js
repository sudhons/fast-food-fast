import orderData from '../dbData';

class Data {
  static getAllOrders() {
    return orderData;
  }

  static deleteAllOrders() {
    orderData.length = 0;
  }
}

export default Data;
