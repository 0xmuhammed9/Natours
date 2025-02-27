import Review from '../models/reviews-model.js';
import { deleteOne, createOne, getAll, getOne } from './handlerFactory.js';

const getAllReviews = getAll(Review);
const getOneReview = getOne(Review);
const createReview = createOne(Review);
const deleteReview = deleteOne(Review);

export { createReview, getAllReviews, deleteReview, getOneReview };
