import express from 'express';
import { protect } from '../controllers/auth-controller.js';
import {
  getAllReviews,
  createReview,
} from '../controllers/review-controller.js';

const reviewRoute = express.Router();

reviewRoute.route('/').get(protect,getAllReviews).post(protect,createReview);

export default reviewRoute;
