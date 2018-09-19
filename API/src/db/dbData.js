const orderData = [
  {
    orderId: 1,
    customer: 'James Tunde',
    recipientName: 'Wade',
    recipientAddress: '43 Araromi',
    recipientPhone: 545878843,
    order: [
      {
        mealId: 3,
        quantity: 7,
        unitPrice: 200,
        total: 1400
      }
    ],
    orderedTime: 1537448443629,
    status: 'completed',
    completedTime: 1537448404629,
    acceptedTime: 1537448403629
  },
  {
    orderId: 2,
    customer: 'John Doe',
    recipientName: 'James Bond',
    recipientAddress: '43 Yaba',
    recipientPhone: 9434545,
    order: [
      {
        mealId: 5,
        quantity: 2,
        unitPrice: 200,
        total: 400
      }
    ],
    orderedTime: Date.now(),
    status: 'waiting',
  }
];

export default orderData;
