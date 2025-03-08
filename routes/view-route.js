import express from 'express';
import { isLoggedIn } from '../controllers/auth-controller.js';
import {
  getView,
  getTour,
  login,
  signup,
  getAccout,
  updateUserData,
} from '../controllers/view-controller.js';
import { createBookingCheckout } from '../controllers/booking-controller.js';

const viewRouter = express.Router();

viewRouter.use(isLoggedIn);

/**
 * ****************************************************************************************
 *                                  Routes
 * ****************************************************************************************
 */

//? Termproray Solution for Saving the Booking into Database
viewRouter.get('/', createBookingCheckout, getView);
viewRouter.get('/tour/:slug', getTour);
viewRouter.get('/login', login);
viewRouter.get('/signup', signup);
viewRouter.get('/me', getAccout);
viewRouter.post('/update-data', updateUserData);

export default viewRouter;
