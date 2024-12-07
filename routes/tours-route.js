import express from 'express';
import {
  getAllTour,
  getTour,
  updateTour,
  deleteTour,
  addTour,
} from '../controllers/tours-controller.js';

const toursRoute = express.Router();

toursRoute.route('/').get(getAllTour).post(addTour);
toursRoute.route('/:id').get(getTour).delete(deleteTour).patch(updateTour);

export default toursRoute;
