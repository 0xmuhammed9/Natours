import Review from '../models/reviews-model.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';

const getAllReviews = catchAsync(async (req, res, next) => {
  const Reviews = await Review.find();
  res.status(200).json({
    status: 'success',
    data: {
      Reviews,
    },
  });
});

const createReview = catchAsync(async (req, res, next) => {
  const newReview = (await Review.create(req.body));
  res.status(201).json({
    status: 'success',
    data: {
      newReview,
    },
  });
});

export { createReview, getAllReviews };
