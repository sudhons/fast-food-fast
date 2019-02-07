import express from 'express';

import OrderDBController from '../controllers/OrderDBController';
import OrderValidation from '../validators/OrderValidation';
import authenticateUser from '../auth/authenticateUser';
import UsersValidation from '../validators/UsersValidation';

const orderRouter = express.Router();

orderRouter.get('/', (request, response) => {
  response.status(200);
  return response.json({ status: 200, message: 'Welcome to fast food fast' });
});

orderRouter.post(
  '/orders',
  authenticateUser,
  OrderValidation.validateOrder,
  OrderDBController.postOrder
);

orderRouter.get(
  '/orders',
  authenticateUser,
  UsersValidation.validateAdmin,
  OrderDBController.getAllOrders
);

orderRouter.get(
  '/orders/:orderId',
  authenticateUser,
  UsersValidation.validateAdmin,
  OrderValidation.validateOrderId,
  OrderDBController.getAnOrder
);

orderRouter.put(
  '/orders/:orderId',
  authenticateUser,
  UsersValidation.validateAdmin,
  OrderValidation.validateOrderId,
  OrderValidation.validateStatus,
  OrderDBController.updateOrderStatus
);

orderRouter.delete(
  '/orders/:orderId',
  authenticateUser,
  OrderValidation.validateOrderId,
  OrderDBController.deleteAnOrder
);

export default orderRouter;
