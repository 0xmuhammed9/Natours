import express from 'express';
import { protect } from '../controllers/auth-controller.js';
import {
  getAllReviews,
  createReview,
  deleteReview,
  getOneReview,
} from '../controllers/review-controller.js';
import setTourUserIds from '../middleware/setTourUserIds.js';

const reviewRoute = express.Router({
  mergeParams: true,
});
reviewRoute.use(protect);

reviewRoute.route('/').get(getAllReviews).post(setTourUserIds, createReview);
reviewRoute.route('/:id').delete(deleteReview).get(getOneReview);

export default reviewRoute;
