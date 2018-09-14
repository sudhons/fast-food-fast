import orderData from '../db/dbData';

class Data {
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

  static createNewOrder(recipientName, recipientAddr, recipientPhone, order) {
    const customer = 'Adeolu James';
    const unitPrice = 200;
    order.forEach((value) => {
      const mealOrder = value;
      mealOrder.unitPrice = unitPrice;
      mealOrder.total = value.quantity * unitPrice;
    });
    const newOrder = new Data(customer, recipientName, recipientAddr, recipientPhone, order);
    orderData.push(newOrder);

    return newOrder;
  }

  static getAllOrders() {
    return orderData;
  }

  static getAnOrder(orderId) {
    const requiredOrder = orderData.find(order => order.orderId === orderId);
    return requiredOrder || null;
  }

  static updateOrderStatus(orderId, status) {
    const requiredOrder = Data.getAnOrder(orderId);

    if (requiredOrder) {
      requiredOrder.status = status;
      requiredOrder[`${status}Time`] = Date.now();
    }

    return requiredOrder || null;
  }

  static deleteAllOrders() {
    orderData.length = 0;
  }
}

export default Data;
