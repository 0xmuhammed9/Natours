import expres from 'express';
import { protect } from '../controllers/auth-controller.js';
import {getCheckoutSession} from '../controllers/booking-controller.js';

const bookingRoute = expres.Router();

bookingRoute
  .route('/checkout-session/:tourId')
  .get(protect, getCheckoutSession);

export default bookingRoute;
