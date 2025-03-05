import express from 'express';
import { isLoggedIn } from '../controllers/auth-controller.js';
import {
  getView,
  getTour,
  login,
  signup,
} from '../controllers/view-controller.js';

const viewRouter = express.Router();

// Apply isLoggedIn to all routes
viewRouter.use(isLoggedIn);

viewRouter.get('/', getView);
viewRouter.get('/tour/:slug', getTour);
viewRouter.get('/login', login);
viewRouter.get('/signup', signup);

export default viewRouter;
