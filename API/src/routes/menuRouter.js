import express from 'express';

import MenuDBController from '../controllers/MenuDBController';
import MenuValidation from '../validators/MenuValidation';
import authenticateUser from '../auth/authenticateUser';
import UsersValidation from '../validators/UsersValidation';

const menuRouter = express.Router();

menuRouter.get(
  '/',
  MenuDBController.getAllMeals
);

menuRouter.get(
  '/:menuId',
  MenuValidation.validateMenuId,
  MenuDBController.getAMeal
);

menuRouter.post(
  '/',
  authenticateUser,
  UsersValidation.validateAdmin,
  MenuValidation.validatePostMenu,
  MenuDBController.postAMeal
);

export default menuRouter;
