import { Router } from 'express';

import MenuDBController from '../controllers/MenuDBController';

const menuRouter = new Router();

menuRouter.get('/', MenuDBController.getAllMeals);

export default menuRouter;
