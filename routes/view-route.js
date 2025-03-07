import express from 'express';
import {
  getView,
  getTour,
  login,
  signup,
  getAccount,
} from '../controllers/view-controller.js';
import { isLoggedIn } from '../controllers/auth-controller.js';

const viewRouter = express.Router();
viewRouter.use(isLoggedIn);

viewRouter.get('/', getView);
viewRouter.get('/tour/:slug', getTour);
viewRouter.get('/login', login);
viewRouter.get('/signup', signup);
viewRouter.get('/me',getAccount);

export default viewRouter;
