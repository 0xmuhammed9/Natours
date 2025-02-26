import Review from '../models/reviews-model.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import { deleteOne, createOne } from './handlerFactory.js';

const getAllReviews = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.tourId) filter = { tour: req.params.tourId };
  const Reviews = await Review.find(filter);
  if (Reviews.length === 0) return next(new AppError('No reviews found', 404));
  res.status(200).json({
    status: 'success',
    reslut: Reviews.length,
    data: {
      Reviews,
    },
  });
});

const createReview = createOne(Review);
const deleteReview = deleteOne(Review);

export { createReview, getAllReviews, deleteReview };
