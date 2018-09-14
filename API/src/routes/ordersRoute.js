import express from 'express';

import Order from '../controllers/ordersController';
import Validator from '../validators/validateOrders';

const router = express.Router();

router.get('/', (request, response) => {
  response.status(200);
  return response.json({ status: 200, message: 'Welcome to fast food fast' });
});

router.get('/orders', Order.getAllOrders);

router.post('/orders', Validator.validatePost, Order.postOrder);

router.get('/orders/:orderId', Validator.validateOrderId, Order.getOrder);

export default router;
