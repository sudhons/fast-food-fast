import { Router } from 'express';

import UsersDBController from '../controllers/UsersDBController';
import UsersValidation from '../validators/UsersValidation';

const userRouter = new Router();

userRouter
  .post('/signup', UsersValidation.validateSignup, UsersDBController.signup);

export default userRouter;
