import express from 'express';

import OrderDBController from '../controllers/OrderDBController';
import authenticateUser from '../auth/authenticateUser';
import UsersValidation from '../validators/UsersValidation';

const userOrderRouter = express.Router();

userOrderRouter.get(
  '/:userId/orders',
  authenticateUser,
  UsersValidation.validateUserId,
  UsersValidation.validateUser,
  OrderDBController.getAUserOrders
);

export default userOrderRouter;
