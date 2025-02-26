import express from 'express';
import { protect } from '../controllers/auth-controller.js';
import {
  getAllReviews,
  createReview,
  deleteReview,
} from '../controllers/review-controller.js';

const reviewRoute = express.Router({
  mergeParams: true,
});
reviewRoute.use(protect);

reviewRoute.route('/').get(getAllReviews).post(createReview);
reviewRoute.route('/:id').delete(deleteReview);

export default reviewRoute;
