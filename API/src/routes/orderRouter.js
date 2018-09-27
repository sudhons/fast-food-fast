import express from 'express';

import OrderDBController from '../controllers/OrderDBController';
import OrderValidation from '../validators/OrderValidation';
import authenticateUser from '../auth/authenticateUser';

const orderRouter = express.Router();

orderRouter.get('/', (request, response) => {
  response.status(200);
  return response.json({ status: 200, message: 'Welcome to fast food fast' });
});

orderRouter
  .post(
    '/orders',
    authenticateUser,
    OrderValidation.validateOrder,
    OrderDBController.postOrder
  );

export default orderRouter;
