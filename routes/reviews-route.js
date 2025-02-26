import express from 'express';
import { protect } from '../controllers/auth-controller.js';
import {
  getAllReviews,
  createReview,
} from '../controllers/review-controller.js';

const reviewRoute = express.Router({
  mergeParams: true,
});
reviewRoute.use(protect);

reviewRoute.route('/').get(getAllReviews).post(createReview);

export default reviewRoute;
