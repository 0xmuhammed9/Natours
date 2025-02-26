import express from 'express';
import {
  getAllTour,
  getTour,
  updateTour,
  deleteTour,
  addTour,
} from '../controllers/tours-controller.js';
import { protect, isRestricted } from '../controllers/auth-controller.js';
import reviewRoute from './reviews-route.js';

const toursRoute = express.Router();

toursRoute.use('/:tourId/reviews', reviewRoute);

toursRoute.route('/').get(protect, getAllTour).post(addTour);
toursRoute
  .route('/:id')
  .get(getTour)
  .delete(protect, isRestricted(['admin ', 'lead-guide']), deleteTour)
  .patch(updateTour);

export default toursRoute;
