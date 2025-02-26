import Review from '../models/reviews-model.js';
import catchAsync from '../utils/catchAsync.js';
import { deleteOne } from './handlerFactory.js';

const getAllReviews = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.tourId) filter = { tour: req.params.tourId };
  const Reviews = await Review.find(filter);
  res.status(200).json({
    status: 'success',
    reslut: Reviews.length,
    data: {
      Reviews,
    },
  });
});

const createReview = catchAsync(async (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  const newReview = await Review.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      newReview,
    },
  });
});

const deleteReview = deleteOne(Review);

export { createReview, getAllReviews, deleteReview };
