import express from 'express';

import UsersDBController from '../controllers/UsersDBController';
import UsersValidation from '../validators/UsersValidation';

const userRouter = express.Router();

userRouter.post(
  '/signup',
  UsersValidation.validateSignup,
  UsersDBController.signup
);

userRouter.post(
  '/login',
  UsersValidation.validateLogin,
  UsersDBController.login
);

export default userRouter;
