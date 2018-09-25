import { Router } from 'express';

import MenuDBController from '../controllers/MenuDBController';
import validateMenuId from '../validators/validateMenuId';

const menuRouter = new Router();

menuRouter.get('/', MenuDBController.getAllMeals);

menuRouter.get('/:menuId', validateMenuId, MenuDBController.getAMeal);

export default menuRouter;
