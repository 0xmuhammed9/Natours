import express from 'express';
import { isLoggedIn } from '../controllers/auth-controller.js';
import {
  getView,
  getTour,
  login,
  signup,
  getAccout,
  updateUserData
} from '../controllers/view-controller.js';

const viewRouter = express.Router();

viewRouter.use(isLoggedIn);

viewRouter.get('/', getView);
viewRouter.get('/tour/:slug', getTour);
viewRouter.get('/login', login);
viewRouter.get('/signup', signup);
viewRouter.get('/me', getAccout);
viewRouter.post('update-data',updateUserData);

export default viewRouter;
