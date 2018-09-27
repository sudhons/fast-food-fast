import { Router } from 'express';

import OrderDBController from '../controllers/OrderDBController';
import authenticateUser from '../auth/authenticateUser';
import UsersValidation from '../validators/UsersValidation';

const userOrderRouter = new Router();

userOrderRouter.get(
  '/:userId/orders',
  authenticateUser,
  UsersValidation.validateUserId,
  OrderDBController.getAUserOrders
);

export default userOrderRouter;
