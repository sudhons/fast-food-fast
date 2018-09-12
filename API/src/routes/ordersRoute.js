import express from 'express';

import Order from '../controllers/ordersController';

const router = express.Router();

router.get('/', (request, response) => {
  response.status(200);
  return response.json({ status: 200, message: 'Welcome to fast food fast' });
});

router.get('/orders', Order.getAllOrders);

export default router;
